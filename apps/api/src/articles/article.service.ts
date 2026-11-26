import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import sanitizeHtml from 'sanitize-html';
import { MediaKind, Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../database/prisma.service.js';
import { fieldValidationException } from '../http/validation-exception.js';
import { ArticleMediaService } from './article-media.service.js';
import {
  articleInclude,
  articleCardSelect,
  toArticleCardResponse,
  toArticleResponse,
  toBannerResponse,
  toTaxonomyResponse,
} from './article-response.mapper.js';
import type { CreateArticleDto } from './dto/create-article.dto.js';
import type { CreateBannerDto } from './dto/create-banner.dto.js';
import type { CreateTaxonomyDto } from './dto/create-taxonomy.dto.js';
import type { ArticleQueryDto } from './dto/article-query.dto.js';

const allowedBodyTags = ['p', 'h2', 'h3', 'strong', 'em', 'br', 'img'] as const;

@Injectable()
export class ArticleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly media: ArticleMediaService,
  ) {}

  async listPublishedArticles(query: ArticleQueryDto) {
    const search = query.q?.trim().replace(/[\\%_]/g, '\\$&');
    const where: Prisma.ArticleWhereInput = {
      publishedAt: { lte: new Date() },
      category: query.category ? { slug: query.category } : undefined,
      tags: query.tag ? { some: { tag: { slug: query.tag } } } : undefined,
      author: query.author
        ? { authorProfile: { slug: query.author } }
        : undefined,
      OR: search
        ? [
            { title: { contains: search, mode: 'insensitive' } },
            {
              tags: {
                some: {
                  tag: { name: { contains: search, mode: 'insensitive' } },
                },
              },
            },
          ]
        : undefined,
    };
    const [articles, total] = await this.prisma.$transaction(
      [
        this.prisma.article.findMany({
          where,
          select: articleCardSelect,
          orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
          skip: (query.page - 1) * query.limit,
          take: query.limit,
        }),
        this.prisma.article.count({ where }),
      ],
      { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead },
    );
    return {
      items: articles.map(toArticleCardResponse),
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  }

  async getPublishedArticle(slug: string) {
    const article = await this.prisma.article.findFirst({
      where: { slug, publishedAt: { lte: new Date() } },
      include: articleInclude,
    });
    if (!article) throw new NotFoundException('Article not found');
    return {
      ...toArticleResponse(article),
      bodyHtml: article.bodyHtml,
      updatedAt: article.updatedAt,
    };
  }

  async uploadArticleAsset(
    uploadedById: string,
    kind: MediaKind,
    file: Express.Multer.File | undefined,
  ) {
    return this.media.createAsset(uploadedById, kind, file);
  }

  async listCategories() {
    const values = await this.prisma.articleCategory.findMany({
      orderBy: [{ name: 'asc' }, { id: 'asc' }],
    });
    return values.map(toTaxonomyResponse);
  }

  async createCategory(input: CreateTaxonomyDto) {
    return this.createTaxonomy('category', input.name);
  }

  async listTags() {
    const values = await this.prisma.articleTag.findMany({
      orderBy: [{ name: 'asc' }, { id: 'asc' }],
    });
    return values.map(toTaxonomyResponse);
  }

  async createTag(input: CreateTaxonomyDto) {
    return this.createTaxonomy('tag', input.name);
  }

  async listBanners() {
    const values = await this.prisma.articleBanner.findMany({
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
      include: { image: true },
    });
    return values.map(toBannerResponse);
  }

  async createBanner(
    createdById: string,
    input: CreateBannerDto,
    file: Express.Multer.File | undefined,
  ) {
    const uploaded = await this.media.uploadImage(
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
            title: input.title.trim(),
            description: input.description.trim(),
            imageMediaId: image.id,
            createdById,
          },
          include: { image: true },
        });
      });
      return toBannerResponse(banner);
    } catch (error) {
      await this.media.discard(uploaded.objectKey);
      throw error;
    }
  }

  async createArticle(authorId: string, input: CreateArticleDto) {
    const title = input.title.trim();
    const keyPoints = input.keyPoints.map((point) => point.trim());
    if (keyPoints.some((point) => !point)) {
      throw fieldValidationException({ keyPoints: ['REQUIRED'] });
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
        message: 'Set up the author profile before publishing an article',
      });
    }
    if (!cover) {
      throw fieldValidationException({ coverMediaId: ['INVALID_REFERENCE'] });
    }
    if (!category) {
      throw fieldValidationException({ categoryId: ['INVALID_REFERENCE'] });
    }
    if (tags.length !== input.tagIds.length) {
      throw fieldValidationException({ tagIds: ['INVALID_REFERENCE'] });
    }
    if (!selectedBanner) {
      if (input.bannerId) {
        throw fieldValidationException({ bannerId: ['INVALID_REFERENCE'] });
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
        include: articleInclude,
      });
      return toArticleResponse(article);
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
    const name = rawName.normalize('NFKC').trim().replace(/\s+/g, ' ');
    const normalizedName = name.toLocaleLowerCase('id-ID');
    const slug = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase('id-ID')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    if (!slug) throw fieldValidationException({ name: ['INVALID_FORMAT'] });
    try {
      const value =
        type === 'category'
          ? await this.prisma.articleCategory.create({
              data: { name, normalizedName, slug },
            })
          : await this.prisma.articleTag.create({
              data: { name, normalizedName, slug },
            });
      return toTaxonomyResponse(value);
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
      throw fieldValidationException({ bodyHtml: ['UNSUPPORTED_HTML'] });
    }

    const preliminary = sanitizeHtml(rawHtml, {
      allowedTags: [...allowedBodyTags],
      allowedAttributes: { img: ['data-media-id', 'alt'] },
      allowedSchemes: [],
      enforceHtmlBoundary: true,
    });
    const mediaIds = [...preliminary.matchAll(/data-media-id="([^"]+)"/g)].map(
      (match) => match[1]!,
    );
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
      throw fieldValidationException({ bodyHtml: ['INVALID_MEDIA_REFERENCE'] });
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
    if (invalidImage) {
      throw fieldValidationException({ bodyHtml: ['INVALID_IMAGE'] });
    }

    const text = sanitizeHtml(bodyHtml, {
      allowedTags: [],
      allowedAttributes: {},
    })
      .replace(/&nbsp;/g, ' ')
      .trim();
    if (!text && mediaIds.length === 0) {
      throw fieldValidationException({ bodyHtml: ['REQUIRED'] });
    }
    return bodyHtml;
  }
}
