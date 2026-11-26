import { ApiProperty } from '@nestjs/swagger';
import { MediaKind } from '../../generated/prisma/client.js';

export class MediaAssetResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ enum: MediaKind, enumName: 'MediaKind' })
  kind!: MediaKind;

  @ApiProperty({ format: 'uri' })
  url!: string;

  @ApiProperty({ example: 'image/webp' })
  mimeType!: string;

  @ApiProperty({ example: 123456 })
  sizeBytes!: number;

  @ApiProperty({ example: 1600 })
  width!: number;

  @ApiProperty({ example: 900 })
  height!: number;
}

export class TaxonomyResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  slug!: string;
}

export class ArticleBannerResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  isDefault!: boolean;

  @ApiProperty({ type: () => MediaAssetResponseDto })
  image!: MediaAssetResponseDto;
}

export class ArticleAuthorResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  jobTitle!: string;

  @ApiProperty()
  bio!: string;

  @ApiProperty({ format: 'uri' })
  linkedinUrl!: string;
}

export class CreatedArticleResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  metaDescription!: string;

  @ApiProperty({ format: 'date-time' })
  publishedAt!: string;

  @ApiProperty({ type: () => MediaAssetResponseDto })
  cover!: MediaAssetResponseDto;

  @ApiProperty()
  coverImageAlt!: string;

  @ApiProperty({ type: [String] })
  keyPoints!: string[];

  @ApiProperty({ type: () => TaxonomyResponseDto })
  category!: TaxonomyResponseDto;

  @ApiProperty({ type: () => TaxonomyResponseDto, isArray: true })
  tags!: TaxonomyResponseDto[];

  @ApiProperty({ type: () => ArticleBannerResponseDto })
  banner!: ArticleBannerResponseDto;

  @ApiProperty({ type: () => ArticleAuthorResponseDto })
  author!: ArticleAuthorResponseDto;
}
