import { Module, ValidationPipe } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { CargoRequestModule } from './cargo-requests/cargo-request.module.js';
import { ArticleModule } from './articles/article.module.js';
import { DatabaseModule } from './database/database.module.js';
import { apiLogging } from './logging/logger.js';
import { ApiResponseInterceptor } from './http/api-response.interceptor.js';
import { validationException } from './http/validation-exception.js';
import { HealthController } from './health/health.controller.js';
import { HealthService } from './health/health.service.js';

@Module({
  imports: [
    AuthModule,
    CargoRequestModule,
    ArticleModule,
    DatabaseModule,
    LoggerModule.forRoot({
      pinoHttp: { logger: apiLogging.logger },
      // HTTP logging and request context are installed before the body parser.
      forRoutes: [],
    }),
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
    HealthService,
    { provide: APP_INTERCEPTOR, useClass: ApiResponseInterceptor },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        exceptionFactory: validationException,
      }),
    },
  ],
})
export class AppModule {}
