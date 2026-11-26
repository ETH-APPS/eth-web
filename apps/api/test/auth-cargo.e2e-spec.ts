import { randomUUID } from 'node:crypto';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';
import { hashPassword } from '../src/auth/password.js';
import { PrismaService } from '../src/database/prisma.service.js';
import { configureLogging } from '../src/logging/configure-logging.js';
import { setupApiDocs } from '../src/openapi/setup-api-docs.js';

const cargoInput = {
  shippingMethod: 'FCL',
  cargoType: 'General goods',
  heightCm: 32,
  lengthCm: 44,
  widthCm: 25,
  boxWeightKg: 8.5,
  boxCount: 2,
  notes: 'Handle with care',
};

describe('Auth and cargo request API', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  const createdUserIds: string[] = [];

  beforeAll(async () => {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl || !new URL(databaseUrl).pathname.endsWith('_test')) {
      throw new Error('API tests require a dedicated *_test database');
    }
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    await configureLogging(app);
    setupApiDocs(app);
    await app.init();
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    if (prisma && createdUserIds.length > 0) {
      const requests = await prisma.cargoRequest.findMany({
        where: { customerId: { in: createdUserIds } },
        select: { id: true },
      });
      await prisma.cargoRequestReview.deleteMany({
        where: { cargoRequestId: { in: requests.map((item) => item.id) } },
      });
      await prisma.cargoRequest.deleteMany({
        where: { customerId: { in: createdUserIds } },
      });
      await prisma.refreshSession.deleteMany({
        where: { userId: { in: createdUserIds } },
      });
      await prisma.user.deleteMany({ where: { id: { in: createdUserIds } } });
    }
    await app?.close();
  });

  async function register() {
    const email = `customer-${randomUUID()}@example.test`;
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email,
        firstName: 'Test',
        password: 'safe-password-123',
        acceptedTerms: true,
      })
      .expect(201);
    expect(response.body.request_id).toBe(response.headers['x-request-id']);
    createdUserIds.push(response.body.data.user.id);
    return { email, ...response.body.data };
  }

  it('serves interactive docs and an OpenAPI contract for auth', async () => {
    await request(app.getHttpServer()).get('/docs').expect(200);
    const response = await request(app.getHttpServer())
      .get('/docs-json')
      .expect(200);
    const document = response.body;
    expect(document.paths['/auth/register'].post).toBeDefined();
    expect(
      document.paths['/auth/login'].post.requestBody.content['application/json']
        .schema,
    ).toMatchObject({
      $ref: '#/components/schemas/LoginDto',
    });
    expect(document.components.schemas.LoginDto.required).toEqual(
      expect.arrayContaining(['email', 'password']),
    );
    expect(document.components.schemas.RegisterDto.required).toEqual(
      expect.arrayContaining([
        'email',
        'firstName',
        'password',
        'acceptedTerms',
      ]),
    );
    expect(
      document.components.schemas.RegisterDto.properties.password,
    ).toMatchObject({
      type: 'string',
      format: 'password',
    });
    expect(document.paths['/auth/me'].get.security).toEqual([{ bearer: [] }]);
    expect(document.paths['/staff/cargo-requests'].get.security).toEqual([
      { bearer: [] },
    ]);
    expect(
      document.paths['/auth/register'].post.responses['201'].content[
        'application/json'
      ].schema,
    ).toMatchObject({
      required: ['request_id', 'data'],
      properties: {
        data: { $ref: '#/components/schemas/AuthTokenResponseDto' },
      },
    });
    expect(
      document.paths['/auth/login'].post.responses['401'].content[
        'application/json'
      ].schema,
    ).toMatchObject({ $ref: '#/components/schemas/ApiErrorResponseDto' });
  });

  it('returns field validation errors before attempting login', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'invalid-email', password: '', unexpected: true })
      .expect(400);
    expect(response.body.request_id).toBe(response.headers['x-request-id']);
    expect(response.body.error).toEqual({
      code: 'VALIDATION_ERROR',
      message: 'Payload Validation Failed',
      fields: {
        email: ['INVALID_FORMAT'],
        password: ['REQUIRED'],
        unexpected: ['UNKNOWN_FIELD'],
      },
    });
  });

  it('registers, logs in, rotates refresh tokens, and logs out', async () => {
    await request(app.getHttpServer()).get('/auth/me').expect(401);
    await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', 'Bearer invalid-token')
      .expect(401);
    const user = await register();
    expect(user.user).toMatchObject({ email: user.email, role: 'CUSTOMER' });
    expect(user.accessToken).toEqual(expect.any(String));
    expect(user.refreshToken).toEqual(expect.any(String));

    await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${user.accessToken}`)
      .expect(200)
      .expect((response) => {
        expect(response.body.request_id).toBe(response.headers['x-request-id']);
        expect(response.body.data.email).toBe(user.email);
        expect(response.body.data).not.toHaveProperty('passwordHash');
      });
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: user.email, password: 'wrong-password' })
      .expect(401)
      .expect((response) => {
        expect(response.body.request_id).toBe(response.headers['x-request-id']);
        expect(response.body.error).toMatchObject({
          code: 'UNAUTHORIZED',
          message: 'Invalid credentials',
        });
      });
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: user.email,
        firstName: 'Test',
        password: 'safe-password-123',
        acceptedTerms: true,
      })
      .expect(409)
      .expect((response) => expect(response.body.error.code).toBe('CONFLICT'));

    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: user.email, password: 'safe-password-123' })
      .expect(200);
    const rotated = await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refreshToken: login.body.data.refreshToken })
      .expect(200);
    expect(rotated.body.data.refreshToken).not.toBe(
      login.body.data.refreshToken,
    );
    await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refreshToken: login.body.data.refreshToken })
      .expect(401);
    await request(app.getHttpServer())
      .post('/auth/logout')
      .send({ refreshToken: rotated.body.data.refreshToken })
      .expect(204)
      .expect((response) => expect(response.text).toBe(''));
    await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refreshToken: rotated.body.data.refreshToken })
      .expect(401);
  });

  it('keeps cargo requests private and supports staff review and revision', async () => {
    const customer = await register();
    const other = await register();
    const staff = await prisma.user.create({
      data: {
        email: `staff-${randomUUID()}@example.test`,
        firstName: 'Staff',
        passwordHash: await hashPassword('staff-password-123'),
        role: 'STAFF',
      },
    });
    createdUserIds.push(staff.id);
    const staffLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: staff.email, password: 'staff-password-123' })
      .expect(200);
    const staffToken = staffLogin.body.data.accessToken as string;

    await request(app.getHttpServer())
      .post('/cargo-requests')
      .send(cargoInput)
      .expect(401);
    await request(app.getHttpServer())
      .post('/cargo-requests')
      .set('Authorization', `Bearer ${customer.accessToken}`)
      .send({ ...cargoInput, boxCount: 0 })
      .expect(400)
      .expect((response) => {
        expect(response.body.request_id).toBe(response.headers['x-request-id']);
        expect(response.body.error).toMatchObject({
          code: 'VALIDATION_ERROR',
          fields: { boxCount: ['MIN_VALUE'] },
        });
      });
    await request(app.getHttpServer())
      .post('/cargo-requests')
      .set('Authorization', `Bearer ${staffToken}`)
      .send(cargoInput)
      .expect(403);
    const created = await request(app.getHttpServer())
      .post('/cargo-requests')
      .set('Authorization', `Bearer ${customer.accessToken}`)
      .send(cargoInput)
      .expect(201);
    const id = created.body.data.id as string;
    expect(created.body.request_id).toBe(created.headers['x-request-id']);
    expect(created.body.data).toMatchObject({
      status: 'PENDING_REVIEW',
      boxCount: 2,
    });

    await request(app.getHttpServer())
      .get(`/cargo-requests/${id}`)
      .set('Authorization', `Bearer ${other.accessToken}`)
      .expect(404);
    await request(app.getHttpServer())
      .get('/cargo-requests')
      .set('Authorization', `Bearer ${customer.accessToken}`)
      .expect(200)
      .expect((response) => expect(response.body.data).toHaveLength(1));
    await request(app.getHttpServer())
      .post(`/staff/cargo-requests/${id}/review`)
      .set('Authorization', `Bearer ${customer.accessToken}`)
      .send({ decision: 'APPROVED' })
      .expect(403);
    await request(app.getHttpServer())
      .post(`/staff/cargo-requests/${id}/review`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send({ decision: 'NEEDS_REVISION' })
      .expect(400);
    await request(app.getHttpServer())
      .post(`/staff/cargo-requests/${id}/review`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send({ decision: 'NEEDS_REVISION', reason: 'Please confirm dimensions' })
      .expect(201)
      .expect((response) => {
        expect(response.body.data.status).toBe('NEEDS_REVISION');
        expect(response.body.data.latestReview.reason).toBe(
          'Please confirm dimensions',
        );
      });
    await request(app.getHttpServer())
      .put(`/cargo-requests/${id}`)
      .set('Authorization', `Bearer ${other.accessToken}`)
      .send(cargoInput)
      .expect(404);
    await request(app.getHttpServer())
      .put(`/cargo-requests/${id}`)
      .set('Authorization', `Bearer ${customer.accessToken}`)
      .send({ ...cargoInput, boxCount: 3 })
      .expect(200)
      .expect((response) =>
        expect(response.body.data.status).toBe('PENDING_REVIEW'),
      );
    await request(app.getHttpServer())
      .post(`/staff/cargo-requests/${id}/review`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send({ decision: 'APPROVED' })
      .expect(201)
      .expect((response) => expect(response.body.data.status).toBe('APPROVED'));
    await request(app.getHttpServer())
      .put(`/cargo-requests/${id}`)
      .set('Authorization', `Bearer ${customer.accessToken}`)
      .send(cargoInput)
      .expect(409);
    await request(app.getHttpServer())
      .get('/staff/cargo-requests?status=APPROVED')
      .set('Authorization', `Bearer ${staffToken}`)
      .expect(200)
      .expect((response) => {
        expect(
          response.body.data.some((item: { id: string }) => item.id === id),
        ).toBe(true);
      });
    expect(
      await prisma.cargoRequestReview.count({ where: { cargoRequestId: id } }),
    ).toBe(2);

    const rejected = await request(app.getHttpServer())
      .post('/cargo-requests')
      .set('Authorization', `Bearer ${customer.accessToken}`)
      .send(cargoInput)
      .expect(201);
    await request(app.getHttpServer())
      .post(`/staff/cargo-requests/${rejected.body.data.id as string}/review`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send({ decision: 'REJECTED', reason: 'Unsupported cargo' })
      .expect(201)
      .expect((response) => expect(response.body.data.status).toBe('REJECTED'));
  });
});
