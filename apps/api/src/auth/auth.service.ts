import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import argon2 from 'argon2';
import { createHash, randomBytes } from 'node:crypto';
import { Prisma, UserRole } from '../generated/prisma/client.js';
import { PrismaService } from '../database/prisma.service.js';
import type { LoginDto } from './dto/login.dto.js';
import type { GoogleAuthDto } from './dto/google-auth.dto.js';
import type { RegisterDto } from './dto/register.dto.js';
import type { AuthUser } from './auth-user.js';
import { GoogleTokenVerifier } from './google-token-verifier.js';

const ACCESS_TOKEN_SECONDS = 15 * 60;
const REFRESH_TOKEN_DAYS = 30;
const JWT_ISSUER = 'eth-cargo';
const JWT_AUDIENCE = 'eth-cargo-api';

function tokenHash(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

const authUserInclude = {
  permissionGrants: {
    select: { permission: true },
    orderBy: { permission: 'asc' as const },
  },
  authorProfile: true,
} satisfies Prisma.UserInclude;

type UserWithAuthContext = Prisma.UserGetPayload<{
  include: typeof authUserInclude;
}>;

function publicUser(user: UserWithAuthContext): AuthUser {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    permissions: user.permissionGrants.map((grant) => grant.permission),
    authorProfile: user.authorProfile
      ? {
          slug: user.authorProfile.slug,
          jobTitle: user.authorProfile.jobTitle,
          bio: user.authorProfile.bio,
          linkedinUrl: user.authorProfile.linkedinUrl,
        }
      : null,
  };
}

@Injectable()
export class AuthService {
  private readonly jwtSecret: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly google: GoogleTokenVerifier,
  ) {
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret || Buffer.byteLength(secret, 'utf8') < 32) {
      throw new Error('JWT_ACCESS_SECRET must contain at least 32 bytes');
    }
    this.jwtSecret = secret;
  }

  async register(input: RegisterDto) {
    const email = input.email.trim().toLowerCase();
    const passwordHash = await argon2.hash(input.password, {
      type: argon2.argon2id,
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1,
    });
    let user: UserWithAuthContext;
    try {
      user = await this.prisma.user.create({
        data: {
          email,
          firstName: input.firstName.trim(),
          lastName: input.lastName?.trim() || null,
          whatsapp: input.whatsapp?.trim() || null,
          passwordHash,
        },
        include: authUserInclude,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Email is already registered');
      }
      throw error;
    }
    return this.issueTokens(user);
  }

  async login(input: LoginDto) {
    const email = input.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: authUserInclude,
    });
    if (
      !user?.passwordHash ||
      !(await argon2.verify(user.passwordHash, input.password))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.issueTokens(user);
  }

  async googleLogin(input: GoogleAuthDto) {
    const identity = await this.google.verify(input.idToken);
    const linked = await this.prisma.user.findUnique({
      where: { googleSub: identity.sub },
      include: authUserInclude,
    });
    if (linked) return this.issueTokens(linked);

    const existing = await this.prisma.user.findUnique({
      where: { email: identity.email },
    });
    if (existing) {
      throw new ConflictException({
        code: 'ACCOUNT_LINK_REQUIRED',
        message: 'Sign in with your password, then link Google to this account',
      });
    }
    if (input.acceptedTerms !== true) {
      throw new BadRequestException({
        code: 'TERMS_ACCEPTANCE_REQUIRED',
        message: 'Accept the terms before creating an account',
      });
    }

    try {
      const user = await this.prisma.user.create({
        data: {
          email: identity.email,
          firstName: identity.firstName,
          lastName: identity.lastName,
          googleSub: identity.sub,
        },
        include: authUserInclude,
      });
      return this.issueTokens(user);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const linkedAfterRace = await this.prisma.user.findUnique({
          where: { googleSub: identity.sub },
          include: authUserInclude,
        });
        if (linkedAfterRace) return this.issueTokens(linkedAfterRace);
        throw new ConflictException({
          code: 'ACCOUNT_LINK_REQUIRED',
          message:
            'Sign in with your password, then link Google to this account',
        });
      }
      throw error;
    }
  }

  async linkGoogle(userId: string, idToken: string): Promise<void> {
    const identity = await this.google.verify(idToken);
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('Invalid access token');
    if (user.role !== UserRole.CUSTOMER) {
      throw new ForbiddenException('Google sign-in is for customers only');
    }
    if (user.email !== identity.email) {
      throw new ConflictException({
        code: 'GOOGLE_EMAIL_MISMATCH',
        message: 'Google email must match your account email',
      });
    }
    if (user.googleSub === identity.sub) return;
    if (user.googleSub) {
      throw new ConflictException('Another Google account is already linked');
    }
    try {
      const linked = await this.prisma.user.updateMany({
        where: { id: userId, googleSub: null },
        data: { googleSub: identity.sub },
      });
      if (linked.count !== 1) {
        throw new ConflictException('Another Google account is already linked');
      }
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Google account is already linked');
      }
      throw error;
    }
  }

  async refresh(refreshToken: string) {
    const now = new Date();
    const nextRefreshToken = randomBytes(48).toString('base64url');
    const user = await this.prisma.$transaction(async (transaction) => {
      const session = await transaction.refreshSession.findUnique({
        where: { tokenHash: tokenHash(refreshToken) },
        include: { user: { include: authUserInclude } },
      });
      if (!session || session.revokedAt || session.expiresAt <= now) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const revoked = await transaction.refreshSession.updateMany({
        where: { id: session.id, revokedAt: null, expiresAt: { gt: now } },
        data: { revokedAt: now },
      });
      if (revoked.count !== 1) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      await transaction.refreshSession.create({
        data: {
          userId: session.userId,
          tokenHash: tokenHash(nextRefreshToken),
          expiresAt: new Date(
            now.getTime() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000,
          ),
        },
      });
      return session.user;
    });
    return this.tokenResponse(user, nextRefreshToken);
  }

  async logout(refreshToken: string): Promise<void> {
    await this.prisma.refreshSession.updateMany({
      where: { tokenHash: tokenHash(refreshToken), revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async verifyAccessToken(token: string): Promise<AuthUser> {
    let payload: { sub?: string };
    try {
      payload = await this.jwt.verifyAsync<{ sub?: string }>(token, {
        secret: this.jwtSecret,
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
      });
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }
    if (!payload.sub) {
      throw new UnauthorizedException('Invalid access token');
    }
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: authUserInclude,
    });
    if (!user) {
      throw new UnauthorizedException('Invalid access token');
    }
    return publicUser(user);
  }

  private async issueTokens(user: UserWithAuthContext) {
    const refreshToken = randomBytes(48).toString('base64url');
    await this.prisma.refreshSession.create({
      data: {
        userId: user.id,
        tokenHash: tokenHash(refreshToken),
        expiresAt: new Date(
          Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000,
        ),
      },
    });
    return this.tokenResponse(user, refreshToken);
  }

  private async tokenResponse(
    user: UserWithAuthContext,
    refreshToken: string,
  ) {
    const accessToken = await this.jwt.signAsync(
      { sub: user.id, role: user.role },
      {
        secret: this.jwtSecret,
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
        expiresIn: ACCESS_TOKEN_SECONDS,
      },
    );
    return {
      user: publicUser(user),
      tokenType: 'Bearer' as const,
      accessToken,
      refreshToken,
      expiresInSeconds: ACCESS_TOKEN_SECONDS,
    };
  }
}
