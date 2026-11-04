import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger as NestLogger,
  Post,
  Res,
  Req,
  UnauthorizedException,
  UseGuards,
  type INestApplication,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { Response, Request } from 'express';
import { LoggerModule } from 'nestjs-pino';
import request from 'supertest';
import type { Server } from 'node:http';
import { configureLogging } from '../src/logging/configure-logging.js';
import { createLogging, setHttpLogSummary } from '../src/logging/logger.js';

@Controller()
class LoggingTestController {
  @Post('echo')
  echo(
    @Body() body: unknown,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    setHttpLogSummary(req, { input: body, result: { id: 'sample' } });
    res.setHeader('set-cookie', 'session=response-cookie');
    return { received: body, accessToken: 'response-secret' };
  }

  @Get('failure')
  fail() {
    throw new Error('Test server failure');
  }

  @Get('bad-request')
  badRequest() {
    throw new BadRequestException('Invalid sample');
  }

  @Get('guarded')
  @UseGuards({
    canActivate: () => {
      throw new UnauthorizedException('Missing login');
    },
  })
  guarded() {
    return 'unreachable';
  }

  @Get('context')
  async context() {
    await new Promise((resolve) => setTimeout(resolve, 5));
    new NestLogger('LoggingTest').log({ event: 'test.context' });
    return 'ok';
  }

  @Get('stream')
  stream(@Res() res: Response) {
    res.end('streamed content');
  }
}

describe('HTTP logging', () => {
  let app: INestApplication<Server>;
  const lines: string[] = [];
  const events = () => lines.map((line) => JSON.parse(line));

  beforeAll(async () => {
    const logging = createLogging(
      { LOG_FORMAT: 'json' },
      {
        write: (line) => {
          lines.push(line);
        },
      },
    );
    const module = await Test.createTestingModule({
      imports: [
        LoggerModule.forRoot({
          pinoHttp: { logger: logging.logger },
          forRoutes: [],
        }),
      ],
      controllers: [LoggingTestController],
    }).compile();
    app = module.createNestApplication({ bufferLogs: true });
    await configureLogging(app, logging);
    await app.init();
  });
  beforeEach(() => {
    lines.length = 0;
  });
  afterAll(async () => {
    await app?.close();
  });

  it('initializes logging without opening a port', () => {
    expect(app.getHttpServer().listening).toBe(false);
    new NestLogger('InitializationTest').log({ event: 'test.initialized' });
    expect(events()).toContainEqual(
      expect.objectContaining({
        event: 'test.initialized',
        level: 'info',
      }),
    );
  });

  it('correlates request/response, captures payloads and redacts secrets', async () => {
    const payload = {
      name: 'sample',
      password: 'request-secret',
      items: [{ api_key: 'nested-secret' }],
    };
    const response = await request(app.getHttpServer())
      .post('/echo?access_token=query-secret&search=parcel')
      .set('x-request-id', 'test-request-123')
      .set('authorization', 'Bearer header-secret')
      .set('cookie', 'session=request-cookie')
      .send(payload)
      .expect(201);
    // Logging must not redact the actual HTTP response or mutate controller input.
    expect(response.body.received).toEqual(payload);
    expect(response.body.accessToken).toBe('response-secret');
    expect(response.headers['x-request-id']).toBe('test-request-123');
    const httpEvents = events().filter((event) => event.method);
    expect(httpEvents).toHaveLength(1);
    expect(httpEvents[0]).toMatchObject({
      requestId: 'test-request-123',
      level: 'info',
      method: 'POST',
      path: '/echo',
      status: 201,
      durationMs: expect.any(Number),
      input: { password: '[REDACTED]' },
      result: { id: 'sample' },
    });
    expect(httpEvents[0]).not.toHaveProperty('responseBody');
    for (const secret of [
      'query-secret',
      'header-secret',
      'request-cookie',
      'request-secret',
      'nested-secret',
      'response-secret',
      'response-cookie',
    ]) {
      expect(lines.join('')).not.toContain(secret);
    }
  });

  it.each([
    ['/bad-request', 400, 'Invalid sample'],
    ['/guarded', 401, 'Missing login'],
    ['/missing', 404, 'Cannot GET /missing'],
    ['/failure', 500, 'Test server failure'],
  ])('logs %s with status and actual error', async (url, status, message) => {
    await request(app.getHttpServer()).get(url).expect(status);
    const event = events().find((entry) => entry.method);
    expect(events().filter((entry) => entry.method)).toHaveLength(1);
    expect(events().filter((entry) => entry.level === 'error')).toHaveLength(
      status >= 500 ? 1 : 0,
    );
    expect(event.error).not.toHaveProperty('stack');
    expect(event).toMatchObject({
      level: status >= 500 ? 'error' : 'warn',
      status,
      error: { message },
    });
  });

  it('logs malformed JSON even when parsing fails before the controller', async () => {
    await request(app.getHttpServer())
      .post('/echo')
      .set('content-type', 'application/json')
      .send('{"invalid":')
      .expect(400);
    expect(events().find((event) => event.method)).toMatchObject({
      level: 'warn',
      method: 'POST',
      path: '/echo',
      status: 400,
    });
  });

  it('redacts tokens in URLs reflected by a not-found error', async () => {
    await request(app.getHttpServer())
      .get('/missing?token=reflected-secret')
      .expect(404);
    expect(lines.join('')).not.toContain('reflected-secret');
  });

  it('isolates request IDs across concurrent asynchronous application logs', async () => {
    await Promise.all(
      ['request-a', 'request-b'].map((id) =>
        request(app.getHttpServer())
          .get('/context')
          .set('x-request-id', id)
          .expect(200),
      ),
    );
    const ids = events()
      .filter((event) => event.event === 'test.context')
      .map((event) => event.requestId);
    expect(ids.sort((a, b) => a.localeCompare(b))).toEqual([
      'request-a',
      'request-b',
    ]);
  });

  it('replaces invalid incoming IDs and leaves streamed responses intact', async () => {
    const response = await request(app.getHttpServer())
      .get('/stream')
      .set('x-request-id', 'invalid id')
      .expect(200)
      .expect('streamed content');
    expect(response.headers['x-request-id']).toMatch(/^[\w-]{36}$/);
    expect(events().find((event) => event.method).responseBody).toBeUndefined();
  });
});
