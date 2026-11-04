import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { apiLogging } from './logging/logger.js';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: { logger: apiLogging.logger },
      // HTTP logging and request context are installed before the body parser.
      forRoutes: [],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
