import { randomUUID } from 'node:crypto';
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';
import { PrismaService } from '../src/database/prisma.service.js';
import {
  MediaKind,
  type Article,
  type ArticleBanner,
  type ArticleCategory,
  type ArticleTag,
  type MediaAsset,
} from '../src/generated/prisma/client.js';
import { configureLogging } from '../src/logging/configure-logging.js';
import { setupApiDocs } from '../src/openapi/setup-api-docs.js';

describe('Public article API', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let cover: MediaAsset;
  let bodyImage: MediaAsset;
  let banner: ArticleBanner;
  const token = randomUUID();
  const prefix = `Public ${token}`;
  const userIds: string[] = [];
  const authorSlugs = [`writer-one-${token}`, `writer-two-${token}`];
  const categories: ArticleCategory[] = [];
  const tags: ArticleTag[] = [];
  const articles: Article[] = [];

  beforeAll(async () => {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl || !new URL(databaseUrl).pathname.endsWith('_test')) {
      throw new Error('API tests require a dedicated *_test database');
    }
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    await configureLogging(app);
    setupApiDocs(app);
    await app.init();
    prisma = app.get(PrismaService);

    for (const index of [0, 1]) {
      const user = await prisma.user.create({
        data: {
          email: `public-${index}-${token}@example.test`,
          firstName: `Writer ${index + 1}`,
          role: 'STAFF',
          authorProfile: {
            create: {
              slug: authorSlugs[index]!,
              jobTitle: 'Logistics Writer',
              bio: 'Articles about logistics.',
              linkedinUrl: 'https://www.linkedin.com/in/public-writer/',
            },
          },
        },
      });
      userIds.push(user.id);
      categories.push(
        await prisma.articleCategory.create({
          data: {
            name: `Category ${index} ${token}`,
            normalizedName: `category ${index} ${token}`,
            slug: `category-${index}-${token}`,
          },
        }),
      );
      tags.push(
        await prisma.articleTag.create({
          data: {
            name: `${index === 0 ? 'Export' : 'Import'} ${token}`,
            normalizedName: `${index === 0 ? 'export' : 'import'} ${token}`,
            slug: `tag-${index}-${token}`,
          },
        }),
      );
    }
    categories.push(
      await prisma.articleCategory.create({
        data: {
          name: `A Unused Category ${token}`,
          normalizedName: `a unused category ${token}`,
          slug: `unused-category-${token}`,
        },
      }),
    );
    tags.push(
      await prisma.articleTag.create({
        data: {
          name: `A Unused Tag ${token}`,
          normalizedName: `a unused tag ${token}`,
          slug: `unused-tag-${token}`,
        },
      }),
    );
    cover = await createMedia(MediaKind.ARTICLE_COVER);
    bodyImage = await createMedia(MediaKind.ARTICLE_BODY);
    const bannerImage = await createMedia(MediaKind.BANNER_ILLUSTRATION);
    banner = await prisma.articleBanner.create({
      data: {
        title: 'Ask about importing goods',
        description: 'Talk with our logistics team.',
        imageMediaId: bannerImage.id,
        createdById: userIds[0]!,
      },
    });
    const fixtures = [
      {
        title: 'Cargo Manifest',
        date: new Date('2020-01-03'),
        category: 0,
        author: 0,
        tags: [1, 0],
      },
      {
        title: 'Customs Rules',
        date: new Date('2020-01-02'),
        category: 0,
        author: 1,
        tags: [0],
      },
      {
        title: 'Packaging',
        date: new Date('2020-01-02'),
        category: 0,
        author: 0,
        tags: [1],
      },
      {
        title: 'Air Freight',
        date: new Date('2020-01-01'),
        category: 1,
        author: 0,
        tags: [0],
      },
      {
        title: 'Future Publication',
        date: new Date(Date.now() + 86400000),
        category: 0,
        author: 0,
        tags: [0],
      },
    ];
    for (const [index, fixture] of fixtures.entries()) {
      articles.push(
        await prisma.article.create({
          data: {
            id: `${index}${randomUUID().slice(1)}`,
            slug: `public-${index}-${token}`,
            title: `${prefix} ${fixture.title}`,
            metaDescription: 'An article about logistics.',
            coverMediaId: cover.id,
            coverImageAlt: 'Cargo cover',
            bodyHtml: `<h2>Overview</h2><p>Article content.</p><img data-media-id="${bodyImage.id}" src="${bodyImage.publicUrl}" alt="Cargo illustration">`,
            keyPoints: ['Prepare the shipping documents.'],
            categoryId: categories[fixture.category]!.id,
            authorId: userIds[fixture.author]!,
            bannerId: banner.id,
            publishedAt: fixture.date,
            tags: {
              create: fixture.tags.map((tag) => ({ tagId: tags[tag]!.id })),
            },
          },
        }),
      );
    }
  });

  afterAll(async () => {
    if (prisma) {
      await prisma.article.deleteMany({ where: { authorId: { in: userIds } } });
      await prisma.articleBanner.deleteMany({
        where: { createdById: { in: userIds } },
      });
      await prisma.mediaAsset.deleteMany({
        where: { uploadedById: { in: userIds } },
      });
      await prisma.articleCategory.deleteMany({
        where: { id: { in: categories.map(({ id }) => id) } },
      });
      await prisma.articleTag.deleteMany({
        where: { id: { in: tags.map(({ id }) => id) } },
      });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await app?.close();
  });

  async function createMedia(kind: MediaKind) {
    return prisma.mediaAsset.create({
      data: {
        kind,
        objectKey: `articles/test/${token}/${kind}.webp`,
        publicUrl: `https://cdn.example.test/${token}/${kind}.webp`,
        mimeType: 'image/webp',
        sizeBytes: 128,
        width: 800,
        height: 400,
        uploadedById: userIds[0]!,
      },
    });
  }

  it('documents public routes and preserves security on every CMS route', async () => {
    const response = await request(app.getHttpServer())
      .get('/docs-json')
      .expect(200);
    const document = response.body;
    for (const path of [
      '/articles',
      '/articles/{slug}',
      '/categories',
      '/tags',
    ]) {
      expect(document.paths[path].get.security ?? []).toEqual([]);
      expect(document.paths[path].get.responses['401']).toBeUndefined();
    }
    for (const path of [
      '/cms/categories',
      '/cms/tags',
      '/cms/banners',
      '/cms/articles',
      '/cms/articles/assets',
    ]) {
      for (const method of ['get', 'post']) {
        const operation = document.paths[path][method];
        if (operation) expect(operation.security).toEqual([{ bearer: [] }]);
      }
    }
    expect(document.paths['/articles'].get.parameters).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'page',
          schema: expect.objectContaining({ type: 'number', default: 1 }),
        }),
        expect.objectContaining({
          name: 'limit',
          schema: expect.objectContaining({ maximum: 100, default: 12 }),
        }),
      ]),
    );
    expect(
      document.components.schemas.ArticleCardResponseDto.properties,
    ).not.toHaveProperty('bodyHtml');
    expect(
      document.components.schemas.ArticleDetailResponseDto.properties,
    ).toHaveProperty('bodyHtml');
  });

  it.each(['/categories', '/tags'])(
    'lists all public taxonomy fields alphabetically at %s',
    async (path) => {
      const response = await request(app.getHttpServer()).get(path).expect(200);
      expect(response.body.request_id).toBe(response.headers['x-request-id']);
      expect(response.body.data).toEqual(expect.any(Array));
      const rows = path === '/categories' ? categories : tags;
      const ownRows = response.body.data.filter((item: { slug: string }) =>
        item.slug.endsWith(token),
      );
      expect(ownRows).toEqual(
        [rows[2]!, rows[0]!, rows[1]!].map(({ id, name, slug }) => ({
          id,
          name,
          slug,
        })),
      );
      await request(app.getHttpServer())
        .post(path)
        .send({ name: 'No public create endpoint' })
        .expect(404);
    },
  );

  it('paginates lightweight cards with a deterministic order for matching dates', async () => {
    const first = await request(app.getHttpServer())
      .get('/articles')
      .query({ category: categories[0]!.slug, limit: 2 })
      .expect(200);
    expect(first.body.request_id).toBe(first.headers['x-request-id']);
    expect(first.body.data.pagination).toEqual({
      page: 1,
      limit: 2,
      total: 3,
      totalPages: 2,
    });
    expect(
      first.body.data.items.map((item: { id: string }) => item.id),
    ).toEqual([articles[0]!.id, articles[2]!.id]);
    const second = await request(app.getHttpServer())
      .get('/articles')
      .query({ category: categories[0]!.slug, limit: 2, page: 2 })
      .expect(200);
    expect(
      second.body.data.items.map((item: { id: string }) => item.id),
    ).toEqual([articles[1]!.id]);
    expect(second.body.data.pagination).toEqual({
      page: 2,
      limit: 2,
      total: 3,
      totalPages: 2,
    });
    const card = first.body.data.items[0];
    expect(card).toEqual({
      id: articles[0]!.id,
      slug: articles[0]!.slug,
      title: articles[0]!.title,
      metaDescription: articles[0]!.metaDescription,
      publishedAt: articles[0]!.publishedAt.toISOString(),
      updatedAt: articles[0]!.updatedAt.toISOString(),
      cover: {
        id: cover.id,
        kind: cover.kind,
        url: cover.publicUrl,
        mimeType: cover.mimeType,
        sizeBytes: cover.sizeBytes,
        width: cover.width,
        height: cover.height,
      },
      coverImageAlt: articles[0]!.coverImageAlt,
      category: {
        id: categories[0]!.id,
        name: categories[0]!.name,
        slug: categories[0]!.slug,
      },
      tags: tags.slice(0, 2).map(({ id, name, slug }) => ({ id, name, slug })),
      author: { id: userIds[0], name: 'Writer 1', slug: authorSlugs[0] },
    });
  });

  it('applies defaults and returns empty pages without clamping the requested page', async () => {
    const response = await request(app.getHttpServer())
      .get('/articles')
      .query({ q: prefix })
      .expect(200);
    expect(response.body.data.pagination).toEqual({
      page: 1,
      limit: 12,
      total: 4,
      totalPages: 1,
    });
    const beyond = await request(app.getHttpServer())
      .get('/articles')
      .query({ q: prefix, page: 2 })
      .expect(200);
    expect(beyond.body.data).toEqual({
      items: [],
      pagination: { page: 2, limit: 12, total: 4, totalPages: 1 },
    });
    const empty = await request(app.getHttpServer())
      .get('/articles')
      .query({ category: `missing-${token}` })
      .expect(200);
    expect(empty.body.data).toEqual({
      items: [],
      pagination: { page: 1, limit: 12, total: 0, totalPages: 0 },
    });
  });

  it('filters by category, tag, and author slugs and combines them with AND', async () => {
    const cases = [
      { query: { category: categories[1]!.slug }, expected: [articles[3]!.id] },
      {
        query: { tag: tags[1]!.slug },
        expected: [articles[0]!.id, articles[2]!.id],
      },
      { query: { author: authorSlugs[1] }, expected: [articles[1]!.id] },
      {
        query: {
          category: categories[0]!.slug,
          tag: tags[0]!.slug,
          author: authorSlugs[1],
        },
        expected: [articles[1]!.id],
      },
      {
        query: { category: categories[1]!.slug, tag: tags[1]!.slug },
        expected: [],
      },
    ];
    for (const testCase of cases) {
      const response = await request(app.getHttpServer())
        .get('/articles')
        .query(testCase.query)
        .expect(200);
      expect(
        response.body.data.items.map((item: { id: string }) => item.id),
      ).toEqual(testCase.expected);
      expect(response.body.data.pagination.total).toBe(
        testCase.expected.length,
      );
    }
  });

  it('searches title and tag names without case sensitivity and treats wildcards literally', async () => {
    const byTitle = await request(app.getHttpServer())
      .get('/articles')
      .query({ q: `  ${prefix.toUpperCase()} cArGo  ` })
      .expect(200);
    expect(
      byTitle.body.data.items.map((item: { id: string }) => item.id),
    ).toEqual([articles[0]!.id]);
    const byTag = await request(app.getHttpServer())
      .get('/articles')
      .query({ q: tags[0]!.name.toUpperCase() })
      .expect(200);
    expect(
      byTag.body.data.items.map((item: { id: string }) => item.id),
    ).toEqual([articles[0]!.id, articles[1]!.id, articles[3]!.id]);
    const combined = await request(app.getHttpServer())
      .get('/articles')
      .query({ q: tags[0]!.name, category: categories[1]!.slug })
      .expect(200);
    expect(
      combined.body.data.items.map((item: { id: string }) => item.id),
    ).toEqual([articles[3]!.id]);
    for (const q of ['%', '_', '\\']) {
      const escaped = await request(app.getHttpServer())
        .get('/articles')
        .query({ q, category: categories[0]!.slug })
        .expect(200);
      expect(escaped.body.data.items).toEqual([]);
    }
  });

  it('returns the full stored article and public author profile without authentication', async () => {
    const response = await request(app.getHttpServer())
      .get(`/articles/${articles[0]!.slug}`)
      .expect(200);
    expect(response.body.request_id).toBe(response.headers['x-request-id']);
    expect(response.body.data).toMatchObject({
      id: articles[0]!.id,
      bodyHtml: articles[0]!.bodyHtml,
      keyPoints: articles[0]!.keyPoints,
      publishedAt: articles[0]!.publishedAt.toISOString(),
      updatedAt: articles[0]!.updatedAt.toISOString(),
      banner: {
        id: banner.id,
        title: banner.title,
        description: banner.description,
        image: { kind: MediaKind.BANNER_ILLUSTRATION },
      },
      author: {
        id: userIds[0],
        name: 'Writer 1',
        slug: authorSlugs[0],
        jobTitle: 'Logistics Writer',
        bio: 'Articles about logistics.',
        linkedinUrl: 'https://www.linkedin.com/in/public-writer/',
      },
    });
    expect(response.body.data.author).not.toHaveProperty('email');
    expect(response.body.data.author).not.toHaveProperty('passwordHash');
    expect(response.body.data.cover).not.toHaveProperty('objectKey');
    expect(response.body.data.banner).not.toHaveProperty('createdById');
    expect(response.body.data.banner.image).not.toHaveProperty('objectKey');
  });

  it('hides future publication dates and returns the same 404 as an unknown slug', async () => {
    for (const slug of [articles[4]!.slug, `missing-${token}`]) {
      const response = await request(app.getHttpServer())
        .get(`/articles/${slug}`)
        .expect(404);
      expect(response.body.error).toEqual({
        code: 'NOT_FOUND',
        message: 'Article not found',
      });
      expect(response.body).not.toHaveProperty('data');
    }
  });

  it.each([
    { query: { page: '0' }, field: 'page', code: 'MIN_VALUE' },
    { query: { page: '1.5' }, field: 'page', code: 'INVALID_TYPE' },
    { query: { page: '1000001' }, field: 'page', code: 'MAX_VALUE' },
    { query: { limit: '101' }, field: 'limit', code: 'MAX_VALUE' },
    { query: { limit: 'no' }, field: 'limit', code: 'INVALID_TYPE' },
    {
      query: { category: 'invalid slug' },
      field: 'category',
      code: 'INVALID_FORMAT',
    },
    { query: { q: 'x'.repeat(201) }, field: 'q', code: 'MAX_LENGTH' },
    {
      query: { unexpected: 'value' },
      field: 'unexpected',
      code: 'UNKNOWN_FIELD',
    },
  ])('rejects invalid query $query', async ({ query, field, code }) => {
    const response = await request(app.getHttpServer())
      .get('/articles')
      .query(query)
      .expect(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
    expect(response.body.error.fields[field]).toContain(code);
  });
});
