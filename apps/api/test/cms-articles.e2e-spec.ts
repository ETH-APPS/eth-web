import { randomUUID } from 'node:crypto';
import { type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import argon2 from 'argon2';
import sharp from 'sharp';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';
import { ArticleObjectStorage } from '../src/articles/article-object-storage.js';
import { PrismaService } from '../src/database/prisma.service.js';
import { MediaKind, UserPermission } from '../src/generated/prisma/client.js';
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
  let incompleteAuthorToken: string;
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

    const incompleteAuthor = await prisma.user.create({
      data: {
        email: `cms-no-profile-${randomUUID()}@example.test`,
        firstName: 'Incomplete',
        role: 'STAFF',
        passwordHash,
        permissionGrants: {
          create: { permission: UserPermission.CMS_ACCESS },
        },
      },
    });
    userIds.push(incompleteAuthor.id);
    incompleteAuthorToken = await login(
      incompleteAuthor.email,
      'cms-password-123',
    );
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
      .attach('file', image, {
        filename: `${kind}.webp`,
        contentType: 'image/webp',
      })
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
      .attach('image', image, {
        filename: 'banner.webp',
        contentType: 'image/webp',
      })
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
    expect(document.paths['/cms/articles'].post.tags).toEqual(['Articles']);
    expect(document.paths['/cms/banners'].post.tags).toEqual([
      'Article banners',
    ]);
    expect(document.paths['/cms/categories'].post.tags).toEqual([
      'Article taxonomy',
    ]);
    expect(document.paths['/articles'].get.security ?? []).toEqual([]);
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

  it.each([
    ['get', '/cms/categories'],
    ['post', '/cms/categories'],
    ['get', '/cms/tags'],
    ['post', '/cms/tags'],
    ['get', '/cms/banners'],
    ['post', '/cms/banners'],
    ['post', '/cms/articles/assets'],
    ['post', '/cms/articles'],
  ] as const)(
    'protects %s %s with authentication and CMS permission',
    async (method, path) => {
      await request(app.getHttpServer())[method](path).expect(401);
      await request(app.getHttpServer())
        [method](path)
        .set('Authorization', `Bearer ${staffToken}`)
        .expect(403);
    },
  );

  it('requires an author profile before publishing', async () => {
    await request(app.getHttpServer())
      .post('/cms/articles')
      .set('Authorization', `Bearer ${incompleteAuthorToken}`)
      .send({
        title: 'Artikel tanpa profil',
        slug: `missing-profile-${randomUUID()}`,
        metaDescription: 'Artikel ini tidak boleh diterbitkan.',
        coverMediaId: randomUUID(),
        coverImageAlt: 'Cover',
        bodyHtml: '<p>Isi artikel.</p>',
        keyPoints: ['Poin'],
        categoryId: randomUUID(),
        tagIds: [],
        bannerId: randomUUID(),
      })
      .expect(409)
      .expect((response) => {
        expect(response.body.error.code).toBe('AUTHOR_PROFILE_REQUIRED');
      });
  });

  it('uploads cover and body images into article-specific object keys', async () => {
    const cover = await uploadAsset('ARTICLE_COVER');
    const body = await uploadAsset('ARTICLE_BODY');
    expect(cover).toMatchObject({
      kind: 'ARTICLE_COVER',
      width: 32,
      height: 24,
    });
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
      .attach('file', Buffer.from('not-a-valid-png'), {
        filename: 'broken.png',
        contentType: 'image/png',
      })
      .expect(400)
      .expect((response) => {
        expect(response.body.error.fields.file).toEqual(['INVALID_IMAGE']);
      });
    await request(app.getHttpServer())
      .post('/cms/articles/assets')
      .set('Authorization', `Bearer ${cmsToken}`)
      .field('kind', 'ARTICLE_COVER')
      .attach('file', image, {
        filename: 'fake.png',
        contentType: 'image/png',
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

  it.each([
    {
      name: 'missing',
      file: undefined,
      filename: 'missing.png',
      contentType: 'image/png',
      code: 'REQUIRED',
    },
    {
      name: 'unsupported',
      file: Buffer.from('<svg></svg>'),
      filename: 'image.svg',
      contentType: 'image/svg+xml',
      code: 'UNSUPPORTED_FORMAT',
    },
    {
      name: 'corrupt',
      file: Buffer.from('not-a-valid-png'),
      filename: 'broken.png',
      contentType: 'image/png',
      code: 'INVALID_IMAGE',
    },
  ])('reports $name banner images on the image field', async (input) => {
    const beforeMedia = await prisma.mediaAsset.count({
      where: { uploadedById: cmsUserId },
    });
    const beforeBanners = await prisma.articleBanner.count({
      where: { createdById: cmsUserId },
    });
    const beforeObjects = storage.objects.size;
    const upload = request(app.getHttpServer())
      .post('/cms/banners')
      .set('Authorization', `Bearer ${cmsToken}`)
      .field('title', 'Banner validation')
      .field('description', 'This banner must not be created.');
    if (input.file) {
      upload.attach('image', input.file, {
        filename: input.filename,
        contentType: input.contentType,
      });
    }
    const response = await upload.expect(400);
    expect(response.body.request_id).toBe(response.headers['x-request-id']);
    expect(response.body.error).toEqual({
      code: 'VALIDATION_ERROR',
      message: 'Payload Validation Failed',
      fields: { image: [input.code] },
    });
    expect(
      await prisma.mediaAsset.count({ where: { uploadedById: cmsUserId } }),
    ).toBe(beforeMedia);
    expect(
      await prisma.articleBanner.count({ where: { createdById: cmsUserId } }),
    ).toBe(beforeBanners);
    expect(storage.objects.size).toBe(beforeObjects);
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
      .attach('file', image, {
        filename: 'cover.webp',
        contentType: 'image/webp',
      })
      .expect(500);
    expect(
      await prisma.mediaAsset.count({ where: { uploadedById: cmsUserId } }),
    ).toBe(before);
  });

  it('creates and lists unique categories and tags', async () => {
    const categoryName = `Dokumen ${randomUUID()}`;
    const category = await createCategory(categoryName);
    const tag = await createTag(`Ekspor ${randomUUID()}`);
    expect(category).toEqual({
      id: expect.any(String),
      name: categoryName,
      slug: expect.any(String),
    });
    expect(category.slug).toMatch(/^dokumen-/);
    expect(tag.slug).toMatch(/^ekspor-/);

    await request(app.getHttpServer())
      .post('/cms/categories')
      .set('Authorization', `Bearer ${cmsToken}`)
      .send({
        name: `  ${categoryName.toLocaleUpperCase('id-ID').replace(/ /g, '   ')}  `,
      })
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
      .attach('image', image, {
        filename: 'banner.webp',
        contentType: 'image/webp',
      })
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
    const linkedinUrl = 'https://example.test/existing-author-profile';
    await prisma.authorProfile.update({
      where: { userId: cmsUserId },
      data: { linkedinUrl },
    });
    let response: request.Response;
    try {
      response = await request(app.getHttpServer())
        .post('/cms/articles')
        .set('Authorization', `Bearer ${cmsToken}`)
        .send(input)
        .expect(201);
    } finally {
      await prisma.authorProfile.update({
        where: { userId: cmsUserId },
        data: { linkedinUrl: 'https://www.linkedin.com/in/cms-writer/' },
      });
    }
    expect(response.body.data).toMatchObject({
      slug,
      title: 'Mengenal   Cargo Manifest',
      banner: { id: banner.id },
      author: { id: cmsUserId, name: 'CMS Writer', linkedinUrl },
      cover: { id: cover.id, kind: 'ARTICLE_COVER' },
      category: { id: category.id },
      tags: [{ id: tag.id }],
    });
    expect(response.body.data.author).not.toHaveProperty('passwordHash');
    expect(response.body.data.cover).not.toHaveProperty('objectKey');
    expect(response.body.data.banner).not.toHaveProperty('createdById');
    expect(response.body.data.banner.image).not.toHaveProperty('objectKey');
    expect(response.body.data.category).not.toHaveProperty('normalizedName');
    expect(response.body.data.tags[0]).not.toHaveProperty('normalizedName');
    const stored = await prisma.article.findUniqueOrThrow({ where: { slug } });
    expect(stored.authorId).toBe(cmsUserId);
    expect(stored.bannerId).toBe(banner.id);
    expect(stored.bodyHtml).toContain(body.url);
    expect(stored.bodyHtml).toContain('loading="lazy"');

    await request(app.getHttpServer())
      .get('/articles')
      .query({ category: category.slug })
      .expect(200)
      .expect((listed) => {
        expect(listed.body.data.items).toEqual([
          expect.objectContaining({ id: stored.id, slug }),
        ]);
      });
    await request(app.getHttpServer())
      .get(`/articles/${slug}`)
      .expect(200)
      .expect((published) => {
        expect(published.body.data.bodyHtml).toBe(stored.bodyHtml);
        expect(published.body.data.id).toBe(stored.id);
      });

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
      .send({
        ...input,
        slug: `wrong-media-${randomUUID()}`,
        coverMediaId: body.id,
      })
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
