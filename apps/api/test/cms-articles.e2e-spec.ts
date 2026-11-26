import { randomUUID } from 'node:crypto';
import { type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import argon2 from 'argon2';
import sharp from 'sharp';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';
import { ArticleObjectStorage } from '../src/cms/article-object-storage.js';
import { PrismaService } from '../src/database/prisma.service.js';
import {
  MediaKind,
  UserPermission,
} from '../src/generated/prisma/client.js';
import { configureLogging } from '../src/logging/configure-logging.js';
import { setupApiDocs } from '../src/openapi/setup-api-docs.js';

class FakeArticleObjectStorage {
  readonly objects = new Map<string, Buffer>();
  readonly removed: string[] = [];
  failNextPut = false;

  objectKey(folder: string, fileName: string) {
    return `articles/test/${folder}/${fileName}`;
  }

  publicUrl(objectKey: string) {
    return `https://cdn.example.test/${objectKey}`;
  }

  async put(objectKey: string, body: Buffer) {
    if (this.failNextPut) {
      this.failNextPut = false;
      throw new Error('Fake Spaces failure');
    }
    this.objects.set(objectKey, body);
  }

  async remove(objectKey: string) {
    this.removed.push(objectKey);
    this.objects.delete(objectKey);
  }
}

describe('CMS article create API', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let storage: FakeArticleObjectStorage;
  let image: Buffer;
  let cmsToken: string;
  let cmsUserId: string;
  let staffToken: string;
  const userIds: string[] = [];
  const categoryIds: string[] = [];
  const tagIds: string[] = [];

  beforeAll(async () => {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl || !new URL(databaseUrl).pathname.endsWith('_test')) {
      throw new Error('API tests require a dedicated *_test database');
    }

    storage = new FakeArticleObjectStorage();
    const module = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(ArticleObjectStorage)
      .useValue(storage)
      .compile();
    app = module.createNestApplication();
    await configureLogging(app);
    setupApiDocs(app);
    await app.init();
    prisma = app.get(PrismaService);
    image = await sharp({
      create: {
        width: 32,
        height: 24,
        channels: 3,
        background: '#c3312f',
      },
    })
      .webp()
      .toBuffer();

    const passwordHash = await argon2.hash('cms-password-123');
    const cmsUser = await prisma.user.create({
      data: {
        email: `cms-${randomUUID()}@example.test`,
        firstName: 'CMS',
        lastName: 'Writer',
        role: 'STAFF',
        passwordHash,
        permissionGrants: {
          create: { permission: UserPermission.CMS_ACCESS },
        },
        authorProfile: {
          create: {
            slug: `cms-writer-${randomUUID()}`,
            jobTitle: 'Penulis ETH Cargo',
            bio: 'Penulis artikel logistik ETH Cargo.',
            linkedinUrl: 'https://www.linkedin.com/in/cms-writer/',
          },
        },
      },
    });
    cmsUserId = cmsUser.id;
    userIds.push(cmsUser.id);
    cmsToken = await login(cmsUser.email, 'cms-password-123');

    const staff = await prisma.user.create({
      data: {
        email: `staff-no-cms-${randomUUID()}@example.test`,
        firstName: 'Staff',
        role: 'STAFF',
        passwordHash,
      },
    });
    userIds.push(staff.id);
    staffToken = await login(staff.email, 'cms-password-123');
  });

  afterAll(async () => {
    if (prisma) {
      await prisma.articleTagAssignment.deleteMany({
        where: { article: { authorId: { in: userIds } } },
      });
      await prisma.article.deleteMany({
        where: { authorId: { in: userIds } },
      });
      await prisma.articleBanner.deleteMany({
        where: { createdById: { in: userIds } },
      });
      await prisma.mediaAsset.deleteMany({
        where: { uploadedById: { in: userIds } },
      });
      await prisma.articleCategory.deleteMany({
        where: { id: { in: categoryIds } },
      });
      await prisma.articleTag.deleteMany({
        where: { id: { in: tagIds } },
      });
      await prisma.refreshSession.deleteMany({
        where: { userId: { in: userIds } },
      });
      await prisma.userPermissionGrant.deleteMany({
        where: { userId: { in: userIds } },
      });
      await prisma.authorProfile.deleteMany({
        where: { userId: { in: userIds } },
      });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await app?.close();
  });

  async function login(email: string, password: string) {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(200);
    return response.body.data.accessToken as string;
  }

  async function uploadAsset(kind: 'ARTICLE_COVER' | 'ARTICLE_BODY') {
    const response = await request(app.getHttpServer())
      .post('/cms/articles/assets')
      .set('Authorization', `Bearer ${cmsToken}`)
      .field('kind', kind)
      .attach('file', image, { filename: `${kind}.webp`, contentType: 'image/webp' })
      .expect(201);
    return response.body.data as {
      id: string;
      kind: string;
      url: string;
      width: number;
      height: number;
    };
  }

  async function createCategory(name = `Category ${randomUUID()}`) {
    const response = await request(app.getHttpServer())
      .post('/cms/categories')
      .set('Authorization', `Bearer ${cmsToken}`)
      .send({ name })
      .expect(201);
    categoryIds.push(response.body.data.id);
    return response.body.data as { id: string; name: string; slug: string };
  }

  async function createTag(name = `Tag ${randomUUID()}`) {
    const response = await request(app.getHttpServer())
      .post('/cms/tags')
      .set('Authorization', `Bearer ${cmsToken}`)
      .send({ name })
      .expect(201);
    tagIds.push(response.body.data.id);
    return response.body.data as { id: string; name: string; slug: string };
  }

  async function createBanner() {
    const response = await request(app.getHttpServer())
      .post('/cms/banners')
      .set('Authorization', `Bearer ${cmsToken}`)
      .field('title', 'Konsultasikan Kebutuhan Impor Anda')
      .field('description', 'Tim ETH Cargo siap membantu proses impor Anda.')
      .attach('image', image, { filename: 'banner.webp', contentType: 'image/webp' })
      .expect(201);
    return response.body.data as {
      id: string;
      isDefault: boolean;
      image: { id: string; url: string };
    };
  }

  it('documents protected CMS endpoints and multipart uploads in OpenAPI', async () => {
    const response = await request(app.getHttpServer())
      .get('/docs-json')
      .expect(200);
    const document = response.body;
    expect(document.paths['/cms/articles/assets'].post.security).toEqual([
      { bearer: [] },
    ]);
    expect(
      document.paths['/cms/articles/assets'].post.requestBody.content[
        'multipart/form-data'
      ].schema.properties.file,
    ).toMatchObject({ type: 'string', format: 'binary' });
    expect(
      document.paths['/cms/banners'].post.requestBody.content[
        'multipart/form-data'
      ].schema.properties.image,
    ).toMatchObject({ type: 'string', format: 'binary' });
    expect(document.paths['/cms/articles'].post).toBeDefined();
    expect(document.paths['/articles']).toBeUndefined();
  });

  it('returns CMS permissions and author profile from the existing auth API', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${cmsToken}`)
      .expect(200);
    expect(response.body.data).toMatchObject({
      id: cmsUserId,
      permissions: ['CMS_ACCESS'],
      authorProfile: {
        jobTitle: 'Penulis ETH Cargo',
        linkedinUrl: 'https://www.linkedin.com/in/cms-writer/',
      },
    });
  });

  it('requires authentication and CMS permission', async () => {
    await request(app.getHttpServer()).get('/cms/categories').expect(401);
    await request(app.getHttpServer())
      .get('/cms/categories')
      .set('Authorization', `Bearer ${staffToken}`)
      .expect(403);
  });

  it('uploads cover and body images into article-specific object keys', async () => {
    const cover = await uploadAsset('ARTICLE_COVER');
    const body = await uploadAsset('ARTICLE_BODY');
    expect(cover).toMatchObject({ kind: 'ARTICLE_COVER', width: 32, height: 24 });
    expect(body).toMatchObject({ kind: 'ARTICLE_BODY', width: 32, height: 24 });
    expect(cover.url).toMatch(
      /^https:\/\/cdn\.example\.test\/articles\/test\/covers\/[\w-]+\.webp$/,
    );
    expect(body.url).toMatch(
      /^https:\/\/cdn\.example\.test\/articles\/test\/body\/[\w-]+\.webp$/,
    );
    expect(storage.objects.size).toBeGreaterThanOrEqual(2);
  });

  it('rejects unsupported and oversized files without creating media', async () => {
    const before = await prisma.mediaAsset.count({
      where: { uploadedById: cmsUserId },
    });
    await request(app.getHttpServer())
      .post('/cms/articles/assets')
      .set('Authorization', `Bearer ${cmsToken}`)
      .field('kind', 'ARTICLE_COVER')
      .attach('file', Buffer.from('<svg></svg>'), {
        filename: 'image.svg',
        contentType: 'image/svg+xml',
      })
      .expect(400)
      .expect((response) => {
        expect(response.body.error.fields.file).toEqual(['UNSUPPORTED_FORMAT']);
      });
    await request(app.getHttpServer())
      .post('/cms/articles/assets')
      .set('Authorization', `Bearer ${cmsToken}`)
      .field('kind', 'ARTICLE_COVER')
      .attach('file', Buffer.alloc(5 * 1024 * 1024 + 1), {
        filename: 'too-large.webp',
        contentType: 'image/webp',
      })
      .expect(413);
    expect(
      await prisma.mediaAsset.count({ where: { uploadedById: cmsUserId } }),
    ).toBe(before);
  });

  it('does not create media when object storage fails', async () => {
    const before = await prisma.mediaAsset.count({
      where: { uploadedById: cmsUserId },
    });
    storage.failNextPut = true;
    await request(app.getHttpServer())
      .post('/cms/articles/assets')
      .set('Authorization', `Bearer ${cmsToken}`)
      .field('kind', 'ARTICLE_COVER')
      .attach('file', image, { filename: 'cover.webp', contentType: 'image/webp' })
      .expect(500);
    expect(
      await prisma.mediaAsset.count({ where: { uploadedById: cmsUserId } }),
    ).toBe(before);
  });

  it('creates and lists unique categories and tags', async () => {
    const categoryName = `Dokumen ${randomUUID()}`;
    const category = await createCategory(categoryName);
    const tag = await createTag(`Ekspor ${randomUUID()}`);
    expect(category.slug).toMatch(/^dokumen-/);
    expect(tag.slug).toMatch(/^ekspor-/);

    await request(app.getHttpServer())
      .post('/cms/categories')
      .set('Authorization', `Bearer ${cmsToken}`)
      .send({ name: categoryName.toLocaleUpperCase('id-ID') })
      .expect(409);
    const categories = await request(app.getHttpServer())
      .get('/cms/categories')
      .set('Authorization', `Bearer ${cmsToken}`)
      .expect(200);
    const tags = await request(app.getHttpServer())
      .get('/cms/tags')
      .set('Authorization', `Bearer ${cmsToken}`)
      .expect(200);
    expect(categories.body.data).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: category.id })]),
    );
    expect(tags.body.data).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: tag.id })]),
    );
  });

  it('creates a reusable banner with its image in the banner object path', async () => {
    const banner = await createBanner();
    expect(banner).toMatchObject({ isDefault: false });
    expect(banner.image.url).toMatch(
      /^https:\/\/cdn\.example\.test\/articles\/test\/banners\/[\w-]+\.webp$/,
    );
    const stored = await prisma.articleBanner.findUniqueOrThrow({
      where: { id: banner.id },
      include: { image: true },
    });
    expect(stored.imageMediaId).toBe(banner.image.id);
    expect(stored.image.kind).toBe(MediaKind.BANNER_ILLUSTRATION);

    const listed = await request(app.getHttpServer())
      .get('/cms/banners')
      .set('Authorization', `Bearer ${cmsToken}`)
      .expect(200);
    expect(listed.body.data).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: banner.id })]),
    );
  });

  it('removes an uploaded banner object when its database transaction fails', async () => {
    const transaction = vi
      .spyOn(prisma, '$transaction')
      .mockRejectedValueOnce(new Error('Fake database failure'));
    const beforeRemoved = storage.removed.length;
    await request(app.getHttpServer())
      .post('/cms/banners')
      .set('Authorization', `Bearer ${cmsToken}`)
      .field('title', 'Banner gagal')
      .field('description', 'Transaksi database sengaja digagalkan.')
      .attach('image', image, { filename: 'banner.webp', contentType: 'image/webp' })
      .expect(500);
    expect(storage.removed).toHaveLength(beforeRemoved + 1);
    transaction.mockRestore();
  });

  it('creates and publishes an article with verified media and relations', async () => {
    const category = await createCategory();
    const tag = await createTag();
    const cover = await uploadAsset('ARTICLE_COVER');
    const body = await uploadAsset('ARTICLE_BODY');
    const banner = await createBanner();
    await prisma.articleBanner.update({
      where: { id: banner.id },
      data: { isDefault: true },
    });
    const slug = `article-${randomUUID()}`;
    const input = {
      title: '  Mengenal   Cargo Manifest  ',
      slug,
      metaDescription: 'Penjelasan cargo manifest untuk ekspor dan impor.',
      coverMediaId: cover.id,
      coverImageAlt: 'Ilustrasi cargo manifest',
      bodyHtml: `<p>Isi artikel.</p><h2>Pengertian</h2><p><strong>Penting</strong></p><img data-media-id="${body.id}" alt="Ilustrasi isi">`,
      keyPoints: ['Dokumen mencatat rincian muatan.'],
      categoryId: category.id,
      tagIds: [tag.id],
    };
    const response = await request(app.getHttpServer())
      .post('/cms/articles')
      .set('Authorization', `Bearer ${cmsToken}`)
      .send(input)
      .expect(201);
    expect(response.body.data).toMatchObject({
      slug,
      title: 'Mengenal Cargo Manifest',
      banner: { id: banner.id },
      author: { id: cmsUserId, name: 'CMS Writer' },
      cover: { id: cover.id, kind: 'ARTICLE_COVER' },
      category: { id: category.id },
      tags: [{ id: tag.id }],
    });
    const stored = await prisma.article.findUniqueOrThrow({ where: { slug } });
    expect(stored.authorId).toBe(cmsUserId);
    expect(stored.bannerId).toBe(banner.id);
    expect(stored.bodyHtml).toContain(body.url);
    expect(stored.bodyHtml).toContain('loading="lazy"');

    await request(app.getHttpServer())
      .post('/cms/articles')
      .set('Authorization', `Bearer ${cmsToken}`)
      .send(input)
      .expect(409)
      .expect((duplicate) => {
        expect(duplicate.body.error.code).toBe('ARTICLE_SLUG_CONFLICT');
      });
    await request(app.getHttpServer())
      .post('/cms/articles')
      .set('Authorization', `Bearer ${cmsToken}`)
      .send({ ...input, slug: `wrong-media-${randomUUID()}`, coverMediaId: body.id })
      .expect(400)
      .expect((invalid) => {
        expect(invalid.body.error.fields.coverMediaId).toEqual([
          'INVALID_REFERENCE',
        ]);
      });
    await request(app.getHttpServer())
      .post('/cms/articles')
      .set('Authorization', `Bearer ${cmsToken}`)
      .send({
        ...input,
        slug: `unsafe-html-${randomUUID()}`,
        bodyHtml: '<script>alert(1)</script><p>Isi</p>',
      })
      .expect(400)
      .expect((invalid) => {
        expect(invalid.body.error.fields.bodyHtml).toEqual([
          'UNSUPPORTED_HTML',
        ]);
      });
  });
});
