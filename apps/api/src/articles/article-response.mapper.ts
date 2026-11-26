import type {
  ArticleBanner,
  ArticleCategory,
  MediaAsset,
  Prisma,
} from '../generated/prisma/client.js';

export const articleInclude = {
  coverMedia: true,
  category: true,
  banner: { include: { image: true } },
  author: { include: { authorProfile: true } },
  tags: { include: { tag: true } },
} satisfies Prisma.ArticleInclude;

type ArticleWithRelations = Prisma.ArticleGetPayload<{
  include: typeof articleInclude;
}>;

export function toMediaResponse(media: MediaAsset) {
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

export function toTaxonomyResponse(
  value: Pick<ArticleCategory, 'id' | 'name' | 'slug'>,
) {
  return { id: value.id, name: value.name, slug: value.slug };
}

export function toBannerResponse(value: ArticleBanner & { image: MediaAsset }) {
  return {
    id: value.id,
    title: value.title,
    description: value.description,
    isDefault: value.isDefault,
    image: toMediaResponse(value.image),
  };
}

export function toArticleResponse(article: ArticleWithRelations) {
  const profile = article.author.authorProfile!;
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    metaDescription: article.metaDescription,
    publishedAt: article.publishedAt,
    cover: toMediaResponse(article.coverMedia),
    coverImageAlt: article.coverImageAlt,
    keyPoints: article.keyPoints,
    category: toTaxonomyResponse(article.category),
    tags: article.tags
      .map(({ tag }) => toTaxonomyResponse(tag))
      .sort((first, second) => first.name.localeCompare(second.name, 'id-ID')),
    banner: toBannerResponse(article.banner),
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
}
