import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOperation,
  ApiPayloadTooLargeResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { AuthUser } from '../auth/auth-user.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { MediaKind } from '../generated/prisma/client.js';
import { ApiErrorResponseDto } from '../openapi/api-error-response.dto.js';
import { ApiDataResponse } from '../openapi/api-data-response.decorator.js';
import { ArticleService } from './article.service.js';
import { CmsAccess } from './cms-access.decorator.js';
import { ArticleAssetUploadDto } from './dto/article-asset-upload.dto.js';
import { ArticleQueryDto } from './dto/article-query.dto.js';
import { CreateArticleDto } from './dto/create-article.dto.js';
import { CreateBannerDto } from './dto/create-banner.dto.js';
import { CreateTaxonomyDto } from './dto/create-taxonomy.dto.js';
import {
  ArticleBannerResponseDto,
  ArticleDetailResponseDto,
  ArticleListResponseDto,
  CreatedArticleResponseDto,
  MediaAssetResponseDto,
  TaxonomyResponseDto,
} from './dto/article-response.dto.js';

const uploadOptions = { limits: { fileSize: 5 * 1024 * 1024, files: 1 } };

@Controller()
export class ArticleController {
  constructor(private readonly articles: ArticleService) {}

  @Get('articles')
  @ApiTags('Articles')
  @ApiOperation({ summary: 'List published articles' })
  @ApiDataResponse(200, ArticleListResponseDto)
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  list(@Query() query: ArticleQueryDto) {
    return this.articles.listPublishedArticles(query);
  }

  @Get('articles/:slug')
  @ApiTags('Articles')
  @ApiOperation({ summary: 'Read a published article by slug' })
  @ApiDataResponse(200, ArticleDetailResponseDto)
  @ApiNotFoundResponse({ type: ApiErrorResponseDto })
  get(@Param('slug') slug: string) {
    return this.articles.getPublishedArticle(slug);
  }

  @Get('categories')
  @ApiTags('Article taxonomy')
  @ApiOperation({ summary: 'List all article categories' })
  @ApiDataResponse(200, TaxonomyResponseDto, true)
  listPublicCategories() {
    return this.articles.listCategories();
  }

  @Get('tags')
  @ApiTags('Article taxonomy')
  @ApiOperation({ summary: 'List all article tags' })
  @ApiDataResponse(200, TaxonomyResponseDto, true)
  listPublicTags() {
    return this.articles.listTags();
  }

  @Post('cms/articles/assets')
  @CmsAccess()
  @ApiTags('Articles')
  @UseInterceptors(FileInterceptor('file', uploadOptions))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload an article cover or body image' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'kind'],
      properties: {
        file: { type: 'string', format: 'binary' },
        kind: {
          type: 'string',
          enum: [MediaKind.ARTICLE_COVER, MediaKind.ARTICLE_BODY],
        },
      },
    },
  })
  @ApiDataResponse(201, MediaAssetResponseDto)
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiPayloadTooLargeResponse({ type: ApiErrorResponseDto })
  uploadArticleAsset(
    @CurrentUser() user: AuthUser,
    @Body() input: ArticleAssetUploadDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.articles.uploadArticleAsset(user.id, input.kind, file);
  }

  @Get('cms/categories')
  @CmsAccess()
  @ApiTags('Article taxonomy')
  @ApiOperation({ summary: 'List article categories for the CMS form' })
  @ApiDataResponse(200, TaxonomyResponseDto, true)
  listCategories() {
    return this.articles.listCategories();
  }

  @Post('cms/categories')
  @CmsAccess()
  @ApiTags('Article taxonomy')
  @ApiOperation({ summary: 'Create an article category' })
  @ApiDataResponse(201, TaxonomyResponseDto)
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiConflictResponse({ type: ApiErrorResponseDto })
  createCategory(@Body() input: CreateTaxonomyDto) {
    return this.articles.createCategory(input);
  }

  @Get('cms/tags')
  @CmsAccess()
  @ApiTags('Article taxonomy')
  @ApiOperation({ summary: 'List article tags for the CMS form' })
  @ApiDataResponse(200, TaxonomyResponseDto, true)
  listTags() {
    return this.articles.listTags();
  }

  @Post('cms/tags')
  @CmsAccess()
  @ApiTags('Article taxonomy')
  @ApiOperation({ summary: 'Create an article tag' })
  @ApiDataResponse(201, TaxonomyResponseDto)
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiConflictResponse({ type: ApiErrorResponseDto })
  createTag(@Body() input: CreateTaxonomyDto) {
    return this.articles.createTag(input);
  }

  @Get('cms/banners')
  @CmsAccess()
  @ApiTags('Article banners')
  @ApiOperation({ summary: 'List reusable article banners' })
  @ApiDataResponse(200, ArticleBannerResponseDto, true)
  listBanners() {
    return this.articles.listBanners();
  }

  @Post('cms/banners')
  @CmsAccess()
  @ApiTags('Article banners')
  @UseInterceptors(FileInterceptor('image', uploadOptions))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create an article banner and upload its image' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['title', 'description', 'image'],
      properties: {
        title: { type: 'string', maxLength: 180 },
        description: { type: 'string', maxLength: 1000 },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiDataResponse(201, ArticleBannerResponseDto)
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiPayloadTooLargeResponse({ type: ApiErrorResponseDto })
  createBanner(
    @CurrentUser() user: AuthUser,
    @Body() input: CreateBannerDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.articles.createBanner(user.id, input, image);
  }

  @Post('cms/articles')
  @CmsAccess()
  @ApiTags('Articles')
  @ApiOperation({ summary: 'Create and immediately publish an article' })
  @ApiDataResponse(201, CreatedArticleResponseDto)
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiConflictResponse({ type: ApiErrorResponseDto })
  createArticle(
    @CurrentUser() user: AuthUser,
    @Body() input: CreateArticleDto,
  ) {
    return this.articles.createArticle(user.id, input);
  }
}
