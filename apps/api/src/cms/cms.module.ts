import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { DatabaseModule } from '../database/database.module.js';
import { ArticleObjectStorage } from './article-object-storage.js';
import { CmsController } from './cms.controller.js';
import { CmsService } from './cms.service.js';

@Module({
  imports: [AuthModule, DatabaseModule],
  controllers: [CmsController],
  providers: [CmsService, ArticleObjectStorage],
  exports: [ArticleObjectStorage],
})
export class CmsModule {}
