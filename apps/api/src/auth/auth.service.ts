import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import argon2 from 'argon2';
import { createHash, randomBytes } from 'node:crypto';
import { Prisma, type User } from '../generated/prisma/client.js';
import { PrismaService } from '../database/prisma.service.js';
import type { LoginDto } from './dto/login.dto.js';
import type { RegisterDto } from './dto/register.dto.js';
import type { AuthUser } from './auth-user.js';

const ACCESS_TOKEN_SECONDS = 15 * 60;
const REFRESH_TOKEN_DAYS = 30;
const JWT_ISSUER = 'eth-cargo';
const JWT_AUDIENCE = 'eth-cargo-api';

function tokenHash(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

function publicUser(user: User): AuthUser {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  };
}

@Injectable()
export class AuthService {
  private readonly jwtSecret: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
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
    let user: User;
    try {
      user = await this.prisma.user.create({
        data: {
          email,
          firstName: input.firstName.trim(),
          lastName: input.lastName?.trim() || null,
          whatsapp: input.whatsapp?.trim() || null,
          passwordHash,
        },
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
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await argon2.verify(user.passwordHash, input.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.issueTokens(user);
  }

  async refresh(refreshToken: string) {
    const now = new Date();
    const nextRefreshToken = randomBytes(48).toString('base64url');
    const user = await this.prisma.$transaction(async (transaction) => {
      const session = await transaction.refreshSession.findUnique({
        where: { tokenHash: tokenHash(refreshToken) },
        include: { user: true },
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
    });
    if (!user) {
      throw new UnauthorizedException('Invalid access token');
    }
    return publicUser(user);
  }

  private async issueTokens(user: User) {
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

  private async tokenResponse(user: User, refreshToken: string) {
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
