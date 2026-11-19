import { randomUUID } from 'node:crypto';
import { INestApplication, UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import argon2 from 'argon2';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';
import { PrismaService } from '../src/database/prisma.service.js';
import {
  GoogleTokenVerifier,
  type GoogleIdentity,
} from '../src/auth/google-token-verifier.js';
import { configureLogging } from '../src/logging/configure-logging.js';
import { setupApiDocs } from '../src/openapi/setup-api-docs.js';

describe('Google auth API', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  const identities = new Map<string, GoogleIdentity>();
  const createdUserIds: string[] = [];

  beforeAll(async () => {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl || !new URL(databaseUrl).pathname.endsWith('_test')) {
      throw new Error('API tests require a dedicated *_test database');
    }
    const module = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(GoogleTokenVerifier)
      .useValue({
        verify: async (idToken: string) => {
          const identity = identities.get(idToken);
          if (!identity) {
            throw new UnauthorizedException({
              code: 'INVALID_GOOGLE_TOKEN',
              message: 'Invalid Google ID token',
            });
          }
          return identity;
        },
      })
      .compile();
    app = module.createNestApplication();
    await configureLogging(app);
    setupApiDocs(app);
    await app.init();
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await prisma?.refreshSession.deleteMany({
      where: { userId: { in: createdUserIds } },
    });
    await prisma?.user.deleteMany({ where: { id: { in: createdUserIds } } });
    await app?.close();
  });

  function googleIdentity(email: string): string {
    const token = randomUUID();
    identities.set(token, {
      sub: randomUUID(),
      email,
      firstName: 'Google',
      lastName: 'User',
    });
    return token;
  }

  async function register(email: string) {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email,
        firstName: 'Customer',
        password: 'safe-password-123',
        acceptedTerms: true,
      })
      .expect(201);
    createdUserIds.push(response.body.data.user.id);
    return response.body.data;
  }

  it('documents Google endpoints in OpenAPI', async () => {
    const response = await request(app.getHttpServer())
      .get('/docs-json')
      .expect(200);
    expect(
      response.body.paths['/auth/google'].post.responses['200'],
    ).toBeDefined();
    expect(response.body.paths['/auth/google/link'].post.security).toEqual([
      { bearer: [] },
    ]);
  });

  it('creates a customer after terms acceptance and reuses the same account', async () => {
    const email = `google-${randomUUID()}@example.test`;
    const idToken = googleIdentity(email);
    await request(app.getHttpServer())
      .post('/auth/google')
      .send({ idToken })
      .expect(400)
      .expect((response) =>
        expect(response.body.error.code).toBe('TERMS_ACCEPTANCE_REQUIRED'),
      );
    const first = await request(app.getHttpServer())
      .post('/auth/google')
      .send({ idToken, acceptedTerms: true })
      .expect(200);
    const userId = first.body.data.user.id as string;
    createdUserIds.push(userId);
    expect(first.body.request_id).toBe(first.headers['x-request-id']);
    expect(first.body.data.user).toMatchObject({ email, role: 'CUSTOMER' });
    expect(first.body.data.accessToken).toEqual(expect.any(String));
    expect(first.body.data.refreshToken).toEqual(expect.any(String));
    expect(
      (await prisma.user.findUniqueOrThrow({ where: { id: userId } }))
        .passwordHash,
    ).toBeNull();

    const second = await request(app.getHttpServer())
      .post('/auth/google')
      .send({ idToken })
      .expect(200);
    expect(second.body.data.user.id).toBe(userId);
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password: 'safe-password-123' })
      .expect(401);
    const refreshed = await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refreshToken: first.body.data.refreshToken })
      .expect(200);
    await request(app.getHttpServer())
      .post('/auth/logout')
      .send({ refreshToken: refreshed.body.data.refreshToken })
      .expect(204);
    await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refreshToken: refreshed.body.data.refreshToken })
      .expect(401);
  });

  it('requires password sign-in before linking an existing account', async () => {
    const email = `linked-${randomUUID()}@example.test`;
    const customer = await register(email);
    const idToken = googleIdentity(email);
    await request(app.getHttpServer())
      .post('/auth/google')
      .send({ idToken, acceptedTerms: true })
      .expect(409)
      .expect((response) =>
        expect(response.body.error.code).toBe('ACCOUNT_LINK_REQUIRED'),
      );
    await request(app.getHttpServer())
      .post('/auth/google/link')
      .send({ idToken })
      .expect(401);
    await request(app.getHttpServer())
      .post('/auth/google/link')
      .set('Authorization', `Bearer ${customer.accessToken}`)
      .send({ idToken: googleIdentity(`other-${randomUUID()}@example.test`) })
      .expect(409);
    await request(app.getHttpServer())
      .post('/auth/google/link')
      .set('Authorization', `Bearer ${customer.accessToken}`)
      .send({ idToken })
      .expect(204);
    await request(app.getHttpServer())
      .post('/auth/google/link')
      .set('Authorization', `Bearer ${customer.accessToken}`)
      .send({ idToken })
      .expect(204);
    const googleLogin = await request(app.getHttpServer())
      .post('/auth/google')
      .send({ idToken })
      .expect(200);
    expect(googleLogin.body.data.user.id).toBe(customer.user.id);
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password: 'safe-password-123' })
      .expect(200);
  });

  it('rejects invalid Google tokens and staff linking', async () => {
    await request(app.getHttpServer())
      .post('/auth/google')
      .send({ idToken: 'invalid' })
      .expect(401)
      .expect((response) =>
        expect(response.body.error.code).toBe('INVALID_GOOGLE_TOKEN'),
      );
    const staff = await prisma.user.create({
      data: {
        email: `staff-${randomUUID()}@example.test`,
        firstName: 'Staff',
        passwordHash: await argon2.hash('staff-password-123'),
        role: 'STAFF',
      },
    });
    createdUserIds.push(staff.id);
    const staffLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: staff.email, password: 'staff-password-123' })
      .expect(200);
    await request(app.getHttpServer())
      .post('/auth/google/link')
      .set('Authorization', `Bearer ${staffLogin.body.data.accessToken}`)
      .send({ idToken: googleIdentity(staff.email) })
      .expect(403);
  });
});
