import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import sanitizeHtml from 'sanitize-html';
import sharp from 'sharp';
import {
  MediaKind,
  Prisma,
  type MediaAsset,
} from '../generated/prisma/client.js';
import { PrismaService } from '../database/prisma.service.js';
import { ArticleObjectStorage } from './article-object-storage.js';
import type { CreateArticleDto } from './dto/create-article.dto.js';
import type { CreateBannerDto } from './dto/create-banner.dto.js';
import type { CreateTaxonomyDto } from './dto/create-taxonomy.dto.js';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const imageFormats = {
  jpeg: { extension: 'jpg', mimeType: 'image/jpeg' },
  png: { extension: 'png', mimeType: 'image/png' },
  webp: { extension: 'webp', mimeType: 'image/webp' },
} as const;
const allowedBodyTags = [
  'p',
  'h2',
  'h3',
  'strong',
  'em',
  'br',
  'img',
] as const;

type UploadedImage = {
  objectKey: string;
  publicUrl: string;
  mimeType: string;
  sizeBytes: number;
  width: number;
  height: number;
};

function validationError(field: string, code: string) {
  return new BadRequestException({
    code: 'VALIDATION_ERROR',
    message: 'Payload Validation Failed',
    fields: { [field]: [code] },
  });
}

function mediaResponse(media: MediaAsset) {
  return {
    id: media.id,
    kind: media.kind,
    url: media.publicUrl,
    mimeType: media.mimeType,
    sizeBytes: media.sizeBytes,
    width: media.width,
    height: media.height,
  };
}

function taxonomyResponse(value: { id: string; name: string; slug: string }) {
  return { id: value.id, name: value.name, slug: value.slug };
}

function bannerResponse(value: {
  id: string;
  title: string;
  description: string;
  isDefault: boolean;
  image: MediaAsset;
}) {
  return {
    id: value.id,
    title: value.title,
    description: value.description,
    isDefault: value.isDefault,
    image: mediaResponse(value.image),
  };
}

function normalizedName(value: string): string {
  return value.normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('id-ID');
}

function displayName(value: string): string {
  return value.normalize('NFKC').trim().replace(/\s+/g, ' ');
}

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('id-ID')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

@Injectable()
export class CmsService {
  private readonly logger = new Logger(CmsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: ArticleObjectStorage,
  ) {}

  async uploadArticleAsset(
    uploadedById: string,
    kind: MediaKind,
    file: Express.Multer.File | undefined,
  ) {
    const uploaded = await this.uploadImage(kind, file);
    try {
      const media = await this.prisma.mediaAsset.create({
        data: { ...uploaded, kind, uploadedById },
      });
      return mediaResponse(media);
    } catch (error) {
      await this.removeAfterFailure(uploaded.objectKey);
      throw error;
    }
  }

  async listCategories() {
    const values = await this.prisma.articleCategory.findMany({
      orderBy: [{ name: 'asc' }, { id: 'asc' }],
    });
    return values.map(taxonomyResponse);
  }

  async createCategory(input: CreateTaxonomyDto) {
    return this.createTaxonomy('category', input.name);
  }

  async listTags() {
    const values = await this.prisma.articleTag.findMany({
      orderBy: [{ name: 'asc' }, { id: 'asc' }],
    });
    return values.map(taxonomyResponse);
  }

  async createTag(input: CreateTaxonomyDto) {
    return this.createTaxonomy('tag', input.name);
  }

  async listBanners() {
    const values = await this.prisma.articleBanner.findMany({
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
      include: { image: true },
    });
    return values.map(bannerResponse);
  }

  async createBanner(
    createdById: string,
    input: CreateBannerDto,
    file: Express.Multer.File | undefined,
  ) {
    const uploaded = await this.uploadImage(
      MediaKind.BANNER_ILLUSTRATION,
      file,
    );
    try {
      const banner = await this.prisma.$transaction(async (transaction) => {
        const image = await transaction.mediaAsset.create({
          data: {
            ...uploaded,
            kind: MediaKind.BANNER_ILLUSTRATION,
            uploadedById: createdById,
          },
        });
        return transaction.articleBanner.create({
          data: {
            title: displayName(input.title),
            description: input.description.trim(),
            imageMediaId: image.id,
            createdById,
          },
          include: { image: true },
        });
      });
      return bannerResponse(banner);
    } catch (error) {
      await this.removeAfterFailure(uploaded.objectKey);
      throw error;
    }
  }

  async createArticle(authorId: string, input: CreateArticleDto) {
    const title = displayName(input.title);
    const keyPoints = input.keyPoints.map((point) => point.trim());
    if (keyPoints.some((point) => !point)) {
      throw validationError('keyPoints', 'REQUIRED');
    }

    const [author, cover, category, tags, selectedBanner] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: authorId },
        include: { authorProfile: true },
      }),
      this.prisma.mediaAsset.findFirst({
        where: {
          id: input.coverMediaId,
          uploadedById: authorId,
          kind: MediaKind.ARTICLE_COVER,
        },
      }),
      this.prisma.articleCategory.findUnique({
        where: { id: input.categoryId },
      }),
      this.prisma.articleTag.findMany({
        where: { id: { in: input.tagIds } },
      }),
      input.bannerId
        ? this.prisma.articleBanner.findUnique({
            where: { id: input.bannerId },
          })
        : this.prisma.articleBanner.findFirst({
            where: { isDefault: true },
          }),
    ]);

    if (!author?.authorProfile) {
      throw new ConflictException({
        code: 'AUTHOR_PROFILE_REQUIRED',
        message: 'Complete the author profile before publishing an article',
      });
    }
    if (!cover) throw validationError('coverMediaId', 'INVALID_REFERENCE');
    if (!category) throw validationError('categoryId', 'INVALID_REFERENCE');
    if (tags.length !== input.tagIds.length) {
      throw validationError('tagIds', 'INVALID_REFERENCE');
    }
    if (!selectedBanner) {
      if (input.bannerId) {
        throw validationError('bannerId', 'INVALID_REFERENCE');
      }
      throw new ConflictException({
        code: 'DEFAULT_BANNER_NOT_CONFIGURED',
        message: 'A default article banner has not been configured',
      });
    }

    const bodyHtml = await this.sanitizeBody(authorId, input.bodyHtml);
    try {
      const article = await this.prisma.article.create({
        data: {
          slug: input.slug,
          title,
          metaDescription: input.metaDescription.trim(),
          coverMediaId: cover.id,
          coverImageAlt: input.coverImageAlt.trim(),
          bodyHtml,
          keyPoints,
          categoryId: category.id,
          bannerId: selectedBanner.id,
          authorId,
          tags: {
            create: tags.map((tag) => ({ tagId: tag.id })),
          },
        },
        include: {
          coverMedia: true,
          category: true,
          banner: { include: { image: true } },
          author: { include: { authorProfile: true } },
          tags: { include: { tag: true } },
        },
      });
      const profile = article.author.authorProfile!;
      return {
        id: article.id,
        slug: article.slug,
        title: article.title,
        metaDescription: article.metaDescription,
        publishedAt: article.publishedAt,
        cover: mediaResponse(article.coverMedia),
        coverImageAlt: article.coverImageAlt,
        keyPoints: article.keyPoints,
        category: taxonomyResponse(article.category),
        tags: article.tags
          .map(({ tag }) => taxonomyResponse(tag))
          .sort((first, second) => first.name.localeCompare(second.name, 'id-ID')),
        banner: bannerResponse(article.banner),
        author: {
          id: article.author.id,
          name: [article.author.firstName, article.author.lastName]
            .filter(Boolean)
            .join(' '),
          slug: profile.slug,
          jobTitle: profile.jobTitle,
          bio: profile.bio,
          linkedinUrl: profile.linkedinUrl,
        },
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException({
          code: 'ARTICLE_SLUG_CONFLICT',
          message: 'Article slug is already in use',
        });
      }
      throw error;
    }
  }

  private async createTaxonomy(type: 'category' | 'tag', rawName: string) {
    const name = displayName(rawName);
    const normalized = normalizedName(name);
    const slug = slugify(name);
    if (!slug) throw validationError('name', 'INVALID_FORMAT');
    try {
      const value =
        type === 'category'
          ? await this.prisma.articleCategory.create({
              data: { name, normalizedName: normalized, slug },
            })
          : await this.prisma.articleTag.create({
              data: { name, normalizedName: normalized, slug },
            });
      return taxonomyResponse(value);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException({
          code: `${type.toUpperCase()}_CONFLICT`,
          message: `${type === 'category' ? 'Category' : 'Tag'} already exists`,
        });
      }
      throw error;
    }
  }

  private async uploadImage(
    kind: MediaKind,
    file: Express.Multer.File | undefined,
  ): Promise<UploadedImage> {
    if (!file) throw validationError('file', 'REQUIRED');
    if (file.size > MAX_IMAGE_BYTES) {
      throw validationError('file', 'MAX_SIZE');
    }

    let metadata: Awaited<ReturnType<ReturnType<typeof sharp>['metadata']>>;
    try {
      metadata = await sharp(file.buffer, {
        failOn: 'error',
        limitInputPixels: 40_000_000,
      }).metadata();
    } catch {
      throw validationError('file', 'INVALID_IMAGE');
    }
    const format = metadata.format as keyof typeof imageFormats | undefined;
    const details = format ? imageFormats[format] : undefined;
    if (!details || !metadata.width || !metadata.height) {
      throw validationError('file', 'UNSUPPORTED_FORMAT');
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

  private async sanitizeBody(authorId: string, rawHtml: string) {
    const tagNames = [...rawHtml.matchAll(/<\/?\s*([a-zA-Z0-9-]+)/g)].map(
      (match) => match[1]!.toLocaleLowerCase('en-US'),
    );
    if (
      tagNames.some(
        (tag) => !(allowedBodyTags as readonly string[]).includes(tag),
      ) ||
      /\s(?:style|on[a-z]+)\s*=/i.test(rawHtml)
    ) {
      throw validationError('bodyHtml', 'UNSUPPORTED_HTML');
    }

    const preliminary = sanitizeHtml(rawHtml, {
      allowedTags: [...allowedBodyTags],
      allowedAttributes: { img: ['data-media-id', 'alt'] },
      allowedSchemes: [],
      enforceHtmlBoundary: true,
    });
    const mediaIds = [
      ...preliminary.matchAll(/data-media-id="([^"]+)"/g),
    ].map((match) => match[1]!);
    const uniqueMediaIds = [...new Set(mediaIds)];
    const media = uniqueMediaIds.length
      ? await this.prisma.mediaAsset.findMany({
          where: {
            id: { in: uniqueMediaIds },
            uploadedById: authorId,
            kind: MediaKind.ARTICLE_BODY,
          },
        })
      : [];
    if (media.length !== uniqueMediaIds.length) {
      throw validationError('bodyHtml', 'INVALID_MEDIA_REFERENCE');
    }
    const mediaById = new Map(media.map((item) => [item.id, item]));

    let invalidImage = false;
    const bodyHtml = sanitizeHtml(preliminary, {
      allowedTags: [...allowedBodyTags],
      allowedAttributes: {
        img: [
          'data-media-id',
          'src',
          'alt',
          'width',
          'height',
          'loading',
          'decoding',
        ],
      },
      allowedSchemes: ['https'],
      enforceHtmlBoundary: true,
      transformTags: {
        img: (_tagName, attribs) => {
          const id = attribs['data-media-id'];
          const item = id ? mediaById.get(id) : undefined;
          const alt = attribs.alt?.trim();
          if (!item || !alt) {
            invalidImage = true;
            return {
              tagName: 'img',
              attribs: {} as Record<string, string>,
            };
          }
          return {
            tagName: 'img',
            attribs: {
              'data-media-id': item.id,
              src: item.publicUrl,
              alt,
              width: String(item.width),
              height: String(item.height),
              loading: 'lazy',
              decoding: 'async',
            },
          };
        },
      },
    });
    if (invalidImage) throw validationError('bodyHtml', 'INVALID_IMAGE');

    const text = sanitizeHtml(bodyHtml, { allowedTags: [], allowedAttributes: {} })
      .replace(/&nbsp;/g, ' ')
      .trim();
    if (!text && mediaIds.length === 0) {
      throw validationError('bodyHtml', 'REQUIRED');
    }
    return bodyHtml;
  }

  private async removeAfterFailure(objectKey: string) {
    try {
      await this.storage.remove(objectKey);
    } catch (cleanupError) {
      this.logger.error(
        `Failed to remove article object after database failure: ${objectKey}`,
        cleanupError instanceof Error ? cleanupError.stack : undefined,
      );
    }
  }
}
