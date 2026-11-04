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
import { apiLogging, type createLogging } from './logger.js';

@Catch()
class HttpLoggingExceptionFilter extends BaseExceptionFilter {
  override catch(exception: unknown, host: ArgumentsHost) {
    // Keep Nest's response handling, but give pino-http the actual exception,
    // including failures from guards, middleware, and JSON parsing.
    host.switchToHttp().getResponse<Response>().err = exception as Error;
    if (exception instanceof HttpException) return super.catch(exception, host);
    const known = this.isHttpError(exception);
    const status = known ? exception.statusCode : 500;
    const message =
      known && exception.expose !== false
        ? exception.message
        : known
          ? STATUS_CODES[status]
          : 'Internal server error';
    // Delegate response formatting while preventing Nest's second error log.
    super.catch(
      new HttpException({ statusCode: status, message }, status),
      host,
    );
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
