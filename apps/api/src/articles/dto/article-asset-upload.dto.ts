import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { MediaKind } from '../../generated/prisma/client.js';

const articleAssetKinds = [
  MediaKind.ARTICLE_COVER,
  MediaKind.ARTICLE_BODY,
] as const;

export class ArticleAssetUploadDto {
  @ApiProperty({ enum: articleAssetKinds })
  @IsIn(articleAssetKinds)
  kind!: (typeof articleAssetKinds)[number];
}
