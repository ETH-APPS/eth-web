import { fileURLToPath } from 'node:url';
import { EventEmitter } from 'node:events';
import type { Request, Response } from 'express';
import { createLogging } from './logger.js';
import { bodyForLog, MAX_BODY_BYTES, sanitize } from './sanitize.js';

describe('structured logging', () => {
  it('outputs indented JSON in development and NDJSON in production', () => {
    for (const production of [false, true]) {
      const lines: string[] = [];
      const logging = createLogging(
        { NODE_ENV: production ? 'production' : 'development' },
        {
          write: (line) => {
            lines.push(line);
          },
        },
      );
      logging.logger.info({ event: 'example' }, 'Readable JSON');
      expect(JSON.parse(lines[0])).toMatchObject({
        level: 'info',
        event: 'example',
        msg: 'Readable JSON',
      });
      expect(lines[0].includes('\n  ')).toBe(!production);
      expect(lines[0].endsWith('\n')).toBe(true);
    }
  });

  it('keeps stack traces and redacts nested error metadata', () => {
    const lines: string[] = [];
    const { logger } = createLogging(
      { LOG_FORMAT: 'json' },
      {
        write: (line) => {
          lines.push(line);
        },
      },
    );
    const err = Object.assign(new Error('Example failure'), {
      details: { access_token: 'error-secret' },
    });
    logger.error({ err });
    expect(JSON.parse(lines[0]).err).toMatchObject({
      type: 'Error',
      message: 'Example failure',
      details: { access_token: '[REDACTED]' },
    });
    expect(JSON.parse(lines[0]).err.stack).toContain('logger.spec.ts');
    expect(lines[0]).not.toContain('error-secret');
  });

  it('redacts nested arrays without changing the original payload', () => {
    const payload = {
      items: [{ Password: 'secret', nested: { refresh_token: 'token' } }],
    };
    expect(sanitize(payload)).toEqual({
      items: [
        { Password: '[REDACTED]', nested: { refresh_token: '[REDACTED]' } },
      ],
    });
    expect(payload.items[0].Password).toBe('secret');
  });

  it('redacts credentials reflected in error URLs and preserves JSON dates', () => {
    const error = new Error(
      'Cannot GET /missing?access_token=reflected-secret&search=parcel',
    );
    expect(JSON.stringify(sanitize(error))).not.toContain('reflected-secret');
    expect(bodyForLog({ createdAt: new Date('2026-11-04T00:00:00Z') })).toEqual(
      {
        createdAt: '2026-11-04T00:00:00.000Z',
      },
    );
  });

  it('omits oversized, binary, or malformed JSON bodies', () => {
    expect(bodyForLog({ text: 'x'.repeat(MAX_BODY_BYTES) })).toMatchObject({
      omitted: true,
      reason: 'body_too_large',
      limit: MAX_BODY_BYTES,
    });
    expect(bodyForLog(Buffer.from('file-secret'))).toBe('[Binary omitted]');
    expect(bodyForLog('{"password":"secret"')).toEqual({
      omitted: true,
      reason: 'unparsed_json',
    });
    expect(bodyForLog('{"password":"secret"}')).toEqual({
      password: '[REDACTED]',
    });
  });

  it('honors verbosity and rejects invalid environment settings', () => {
    const lines: string[] = [];
    const { logger } = createLogging(
      { LOG_LEVEL: 'warn' },
      {
        write: (line) => {
          lines.push(line);
        },
      },
    );
    logger.info('hidden');
    logger.warn('visible');
    expect(lines).toHaveLength(1);
    expect(() => createLogging({ LOG_FORMAT: 'text' })).toThrow('LOG_FORMAT');
    expect(() => createLogging({ LOG_HTTP_BODY: 'yes' })).toThrow(
      'LOG_HTTP_BODY',
    );
    expect(() => createLogging({ LOG_LEVEL: 'invalid' })).toThrow('LOG_LEVEL');
  });
});

describe('HTTP output modes', () => {
  it.each([
    ['info', 'true', false],
    ['debug', 'false', false],
    ['debug', 'true', true],
  ])('uses %s with body setting %s', (level, bodies, includeBody) => {
    const lines: string[] = [];
    const logging = createLogging(
      { LOG_FORMAT: 'json', LOG_LEVEL: level, LOG_HTTP_BODY: bodies },
      {
        write: (line) => {
          lines.push(line);
        },
      },
    );
    const req = {
      method: 'POST',
      url: '/form?token=secret',
      headers: {},
      body: { password: 'secret', weight: 12 },
    } as Request;
    const res = Object.assign(new EventEmitter(), {
      statusCode: 500,
      writableFinished: true,
      req,
      err: new Error('Example failure'),
      setHeader() {},
      send(_body: unknown) {
        return this;
      },
      json(_body: unknown) {
        return this;
      },
    }) as unknown as Response;
    logging.middleware(req, res, () => {});
    res.json({ token: 'secret', id: 'sample' });
    res.emit('finish');
    res.emit('close');
    expect(lines).toHaveLength(1);
    const record = JSON.parse(lines[0]);
    expect(record.path).toBe('/form');
    expect(record.error.stack !== undefined).toBe(level === 'debug');
    expect(record.requestBody !== undefined).toBe(includeBody);
    expect(record.responseBody !== undefined).toBe(includeBody);
    expect(lines.join('')).not.toContain('secret');
    expect(record).not.toHaveProperty('headers');
    expect(record).not.toHaveProperty('req');
  });

  it('records a disconnected request once', () => {
    const lines: string[] = [];
    const { middleware } = createLogging(
      { LOG_FORMAT: 'json' },
      {
        write: (line) => {
          lines.push(line);
        },
      },
    );
    const req = { method: 'GET', url: '/', headers: {} } as Request;
    const res = Object.assign(new EventEmitter(), {
      statusCode: 200,
      writableFinished: false,
      destroyed: true,
      setHeader() {},
    }) as unknown as Response;
    middleware(req, res, () => {});
    res.emit('close');
    res.emit('finish');
    expect(lines).toHaveLength(1);
    expect(JSON.parse(lines[0])).toMatchObject({
      level: 'warn',
      aborted: true,
    });
  });
});

describe('HTTP error location', () => {
  it.each(['info', 'debug'])(
    'formats application frames at %s level',
    (level) => {
      const lines: string[] = [];
      const { middleware } = createLogging(
        { LOG_FORMAT: 'json', LOG_LEVEL: level },
        {
          write: (line) => {
            lines.push(line);
          },
        },
      );
      const root = fileURLToPath(new URL('../../', import.meta.url));
      const stack = [
        'Error: failure',
        `    at internal (${root}node_modules/example/index.js:1:2)`,
        '    at external (/outside-project/index.js:3:4)',
        `    at create (file://${root}src/example.service.ts:42:7)`,
        `    at next (${root}src/other.ts:50:8)`,
      ].join('\n');
      const req = { method: 'GET', url: '/', headers: {} } as Request;
      const res = Object.assign(new EventEmitter(), {
        statusCode: 500,
        writableFinished: true,
        err: Object.assign(new Error('failure'), { stack }),
        setHeader() {},
      }) as unknown as Response;
      middleware(req, res, () => {});
      res.emit('finish');
      expect(lines).toHaveLength(1);
      const error = JSON.parse(lines[0]).error;
      expect(error).toEqual(
        level === 'debug'
          ? { message: 'failure', type: 'Error', stack }
          : {
              message: 'failure',
              type: 'Error',
              at: 'src/example.service.ts:42:7',
            },
      );
    },
  );

  it('omits location when no application frame is available', () => {
    const lines: string[] = [];
    const { middleware } = createLogging(
      { LOG_FORMAT: 'json' },
      {
        write: (line) => {
          lines.push(line);
        },
      },
    );
    const req = { method: 'GET', url: '/', headers: {} } as Request;
    const res = Object.assign(new EventEmitter(), {
      statusCode: 500,
      writableFinished: true,
      err: Object.assign(new Error('failure'), {
        stack: 'Error: failure\n    at external (/external/library.js:1:2)',
      }),
      setHeader() {},
    }) as unknown as Response;
    middleware(req, res, () => {});
    res.emit('finish');
    expect(JSON.parse(lines[0]).error).toEqual({
      message: 'failure',
      type: 'Error',
    });
  });
});
