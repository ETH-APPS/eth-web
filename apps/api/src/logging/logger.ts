import { relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import type { Request, RequestHandler, Response } from 'express';
import {
  pino,
  type DestinationStream,
  type LevelWithSilent,
  type Logger,
} from 'pino';
import { pinoHttp } from 'pino-http';
import { bodyForLog, sanitize } from './sanitize.js';

const responseBody = Symbol('responseBody');
const summary = Symbol('httpSummary');
export interface HttpLogSummary {
  input?: unknown;
  result?: unknown;
}
type LoggedRequest = Request & { [summary]?: HttpLogSummary };
export function setHttpLogSummary(req: LoggedRequest, value: HttpLogSummary) {
  req[summary] = {
    ...(value.input !== undefined ? { input: bodyForLog(value.input) } : {}),
    ...(value.result !== undefined ? { result: bodyForLog(value.result) } : {}),
  };
}

type LoggedResponse = Response & { [responseBody]?: unknown };
export interface Logging {
  logger: Logger;
  middleware: RequestHandler;
}

function applicationLocation(stack: string): string | undefined {
  const root = fileURLToPath(new URL('../../', import.meta.url));
  for (const line of stack.split('\n').slice(1)) {
    const match = line.match(/(?:file:\/\/)?(\/[^()]+):(\d+):(\d+)\)?$/);
    if (!match || match[1].includes('/node_modules/')) continue;
    const path = relative(root, match[1]);
    if (path.startsWith('..')) continue;
    return `${path}:${match[2]}:${match[3]}`;
  }
}

function formatHttpError(
  failure: Error | undefined,
  status: number,
  debug: boolean,
) {
  if (!failure && status < 400) return undefined;
  const detail = failure as
    | (Error & {
        response?: { message?: unknown; fields?: unknown };
      })
    | undefined;
  const error: Record<string, unknown> = {
    message: sanitize(
      detail?.response?.message ?? detail?.message ?? `HTTP ${status}`,
    ),
  };
  if (detail?.response?.fields)
    error.fields = bodyForLog(detail.response.fields);
  if (status >= 500) error.type = detail?.name ?? 'Error';
  if (debug && detail?.stack) error.stack = sanitize(detail.stack);
  else if (status >= 500 && detail?.stack) {
    const at = applicationLocation(detail.stack);
    if (at !== undefined) error.at = at;
  }
  return error;
}

export function createLogging(
  env: NodeJS.ProcessEnv = process.env,
  output: DestinationStream = process.stdout,
): Logging {
  const production = env.NODE_ENV === 'production';
  const format = env.LOG_FORMAT ?? (production ? 'json' : 'pretty-json');
  const level = env.LOG_LEVEL ?? 'info';
  const bodySetting = env.LOG_HTTP_BODY ?? 'false';
  if (!['json', 'pretty-json'].includes(format)) {
    throw new Error('LOG_FORMAT must be json or pretty-json');
  }
  if (
    !['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'silent'].includes(
      level,
    )
  ) {
    throw new Error('Invalid LOG_LEVEL');
  }
  if (!['true', 'false'].includes(bodySetting)) {
    throw new Error('LOG_HTTP_BODY must be true or false');
  }
  const debug = ['debug', 'trace'].includes(level);
  const logBodies = debug && bodySetting === 'true';
  const destination: DestinationStream =
    format === 'json'
      ? output
      : {
          write(line: string) {
            // Pino writes one complete JSON record per call. Keep it JSON, not text.
            output.write(`${JSON.stringify(JSON.parse(line), null, 2)}\n`);
          },
        };
  const logger = pino(
    {
      level: level as LevelWithSilent,
      base: null,
      timestamp: pino.stdTimeFunctions.isoTime,
      formatters: { level: (label) => ({ level: label }) },
      serializers: { err: (error: unknown) => sanitize(error) },
      redact: {
        paths: [
          'password',
          'token',
          'secret',
          'authorization',
          '*.password',
          '*.token',
          '*.secret',
        ],
        censor: '[REDACTED]',
      },
    },
    destination,
  );

  function record(
    req: LoggedRequest,
    res: LoggedResponse,
    value: { responseTime?: number; durationMs?: number },
    err?: Error,
  ) {
    const error = formatHttpError(err ?? res.err, res.statusCode, debug);
    return {
      method: req.method,
      path: (req.originalUrl || req.url).split('?')[0],
      status: res.statusCode,
      durationMs: value.durationMs ?? value.responseTime,
      ...req[summary],
      ...(error ? { error } : {}),
      ...(!res.writableFinished ? { aborted: true } : {}),
      ...(logBodies
        ? { requestBody: bodyForLog(req.body), responseBody: res[responseBody] }
        : {}),
    };
  }

  const httpLogger = pinoHttp<Request, LoggedResponse>({
    logger,
    quietReqLogger: true,
    quietResLogger: true,
    wrapSerializers: false,
    customAttributeKeys: { reqId: 'requestId', responseTime: 'durationMs' },
    genReqId(req, res) {
      const supplied = req.headers['x-request-id'];
      const id =
        typeof supplied === 'string' && /^[\w.-]{1,128}$/.test(supplied)
          ? supplied
          : randomUUID();
      res.setHeader('x-request-id', id);
      return id;
    },
    customLogLevel(_req, res, error) {
      if (res.statusCode >= 500) return 'error';
      if (res.statusCode >= 400) return 'warn';
      if (error || res.err) return 'error';
      if (res.destroyed && !res.writableFinished) return 'warn';
      return 'info';
    },
    customSuccessObject: (req, res, value) => record(req, res, value),
    customSuccessMessage: () => undefined as unknown as string,
    customErrorObject: (req, res, error, value) =>
      record(req, res, value, error),
    customErrorMessage: () => undefined as unknown as string,
  });

  const middleware: RequestHandler = (req, res: LoggedResponse, next) => {
    if (logBodies) {
      // Capture Express payloads before serialization, including Nest error bodies.
      // Do not buffer res.write/end: streaming and file responses stay untouched.
      let captured = false;
      const send = res.send;
      const json = res.json;
      res.json = function (body: unknown) {
        if (!captured) {
          this[responseBody] = bodyForLog(body);
          captured = true;
        }
        return json.call(this, body);
      };
      res.send = function (body: unknown) {
        if (!captured) {
          this[responseBody] = bodyForLog(body);
          captured = true;
        }
        return send.call(this, body);
      };
    }
    httpLogger(req, res, next);
  };

  return { logger, middleware };
}

export const apiLogging = createLogging();
