import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { configureLogging } from './logging/configure-logging.js';
import { apiLogging } from './logging/logger.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    abortOnError: false,
  });
  try {
    await configureLogging(app);
    await app.listen(process.env.PORT ?? 3001);
    apiLogging.logger.info(
      { event: 'app.started', url: await app.getUrl() },
      'API ready',
    );
  } catch (err) {
    await app.close();
    throw err;
  }
}
try {
  await bootstrap();
} catch (err) {
  apiLogging.logger.fatal(
    { event: 'app.startup_error', err },
    'API failed to start',
  );
  process.exitCode = 1;
}
