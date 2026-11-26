import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { DatabaseModule } from '../database/database.module.js';
import { ArticleController } from './article.controller.js';
import { ArticleMediaService } from './article-media.service.js';
import { ArticleObjectStorage } from './article-object-storage.js';
import { ArticleService } from './article.service.js';

@Module({
  imports: [AuthModule, DatabaseModule],
  controllers: [ArticleController],
  providers: [ArticleService, ArticleMediaService, ArticleObjectStorage],
})
export class ArticleModule {}
