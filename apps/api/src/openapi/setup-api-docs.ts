import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupApiDocs(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('ETH Cargo API')
    .setDescription('Customer mobile, internal staff, and article CMS API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  SwaggerModule.setup(
    'docs',
    app,
    () =>
      SwaggerModule.createDocument(app, config, {
        autoTagControllers: false,
      }),
    { jsonDocumentUrl: 'docs-json' },
  );
}
