import { STATUS_CODES } from 'node:http';
import {
  Catch,
  HttpException,
  type ArgumentsHost,
  type INestApplication,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import type { Request, Response, NextFunction } from 'express';
import { Logger, PinoLogger } from 'nestjs-pino';
import { getRequestId } from '../http/request-id.js';
import { apiLogging, type createLogging } from './logger.js';

const errorCodes: Record<number, string> = {
  400: 'BAD_REQUEST',
  401: 'UNAUTHORIZED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
};

function responseError(exception: unknown) {
  if (!(exception instanceof HttpException)) return null;
  const detail = exception.getResponse();
  if (typeof detail !== 'object' || detail === null) return null;
  return detail as { code?: unknown; message?: unknown; fields?: unknown };
}

@Catch()
class HttpLoggingExceptionFilter extends BaseExceptionFilter {
  override catch(exception: unknown, host: ArgumentsHost) {
    const request = host.switchToHttp().getRequest<Request>();
    const response = host.switchToHttp().getResponse<Response>();
    // Preserve the original exception for the existing HTTP log.
    response.err = exception as Error;
    if (response.headersSent) return super.catch(exception, host);

    const known = this.isHttpError(exception);
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : known
          ? exception.statusCode
          : 500;
    const detail = responseError(exception);
    const message =
      status >= 500
        ? 'Internal Server Error'
        : typeof detail?.message === 'string'
          ? detail.message
          : exception instanceof HttpException
            ? exception.message
            : known && exception.expose !== false
              ? exception.message
              : (STATUS_CODES[status] ?? 'HTTP Error');
    const code =
      typeof detail?.code === 'string'
        ? detail.code
        : (errorCodes[status] ??
          (status >= 500 ? 'INTERNAL_ERROR' : 'HTTP_ERROR'));
    const fields =
      detail?.fields && typeof detail.fields === 'object'
        ? { fields: detail.fields }
        : {};

    response.status(status).json({
      request_id: getRequestId(request, response),
      error: { code, message, ...fields },
    });
  }
}

export async function configureLogging(
  app: INestApplication,
  logging: ReturnType<typeof createLogging> = apiLogging,
) {
  app.useLogger(app.get(Logger));
  // Register before Nest's body parser so malformed requests are logged as well.
  app.use(logging.middleware);
  const contextLogger = await app.resolve(PinoLogger);
  app.use((req: Request, _res: Response, next: NextFunction) => {
    contextLogger.runInContext(next, { bindings: { requestId: req.id } });
  });
  app.useGlobalFilters(new HttpLoggingExceptionFilter(app.getHttpAdapter()));
}
