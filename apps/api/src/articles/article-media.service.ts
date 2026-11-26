import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import sharp from 'sharp';
import { MediaKind } from '../generated/prisma/client.js';
import { PrismaService } from '../database/prisma.service.js';
import { fieldValidationException } from '../http/validation-exception.js';
import { ArticleObjectStorage } from './article-object-storage.js';
import { toMediaResponse } from './article-response.mapper.js';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const imageFormats = {
  jpeg: { extension: 'jpg', mimeType: 'image/jpeg' },
  png: { extension: 'png', mimeType: 'image/png' },
  webp: { extension: 'webp', mimeType: 'image/webp' },
} as const;
const acceptedMimeTypes = new Set<string>(
  Object.values(imageFormats).map(({ mimeType }) => mimeType),
);

export type UploadedArticleImage = {
  objectKey: string;
  publicUrl: string;
  mimeType: string;
  sizeBytes: number;
  width: number;
  height: number;
};

@Injectable()
export class ArticleMediaService {
  private readonly logger = new Logger(ArticleMediaService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: ArticleObjectStorage,
  ) {}

  async createAsset(
    uploadedById: string,
    kind: MediaKind,
    file: Express.Multer.File | undefined,
  ) {
    const uploaded = await this.uploadImage(kind, file);
    try {
      const media = await this.prisma.mediaAsset.create({
        data: { ...uploaded, kind, uploadedById },
      });
      return toMediaResponse(media);
    } catch (error) {
      await this.discard(uploaded.objectKey);
      throw error;
    }
  }

  async uploadImage(
    kind: MediaKind,
    file: Express.Multer.File | undefined,
  ): Promise<UploadedArticleImage> {
    const field = kind === MediaKind.BANNER_ILLUSTRATION ? 'image' : 'file';
    if (!file) throw fieldValidationException({ [field]: ['REQUIRED'] });
    if (file.size > MAX_IMAGE_BYTES) {
      throw fieldValidationException({ [field]: ['MAX_SIZE'] });
    }
    if (!acceptedMimeTypes.has(file.mimetype)) {
      throw fieldValidationException({ [field]: ['UNSUPPORTED_FORMAT'] });
    }

    let metadata: Awaited<ReturnType<ReturnType<typeof sharp>['metadata']>>;
    try {
      metadata = await sharp(file.buffer, {
        failOn: 'error',
        limitInputPixels: 40_000_000,
      }).metadata();
    } catch {
      throw fieldValidationException({ [field]: ['INVALID_IMAGE'] });
    }

    const format = metadata.format as keyof typeof imageFormats | undefined;
    const details = format ? imageFormats[format] : undefined;
    if (
      !details ||
      details.mimeType !== file.mimetype ||
      !metadata.width ||
      !metadata.height
    ) {
      throw fieldValidationException({ [field]: ['UNSUPPORTED_FORMAT'] });
    }

    const folder =
      kind === MediaKind.ARTICLE_COVER
        ? 'covers'
        : kind === MediaKind.ARTICLE_BODY
          ? 'body'
          : 'banners';
    const objectKey = this.storage.objectKey(
      folder,
      `${randomUUID()}.${details.extension}`,
    );
    await this.storage.put(objectKey, file.buffer, details.mimeType);
    return {
      objectKey,
      publicUrl: this.storage.publicUrl(objectKey),
      mimeType: details.mimeType,
      sizeBytes: file.size,
      width: metadata.width,
      height: metadata.height,
    };
  }

  async discard(objectKey: string): Promise<void> {
    try {
      await this.storage.remove(objectKey);
    } catch (error) {
      this.logger.error(
        `Failed to remove article object after database failure: ${objectKey}`,
        error instanceof Error ? error.stack : undefined,
      );
    }
  }
}
