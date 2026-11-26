import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiOperation,
  ApiPayloadTooLargeResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AccessGuard } from '../auth/auth.guard.js';
import type { AuthUser } from '../auth/auth-user.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { Permissions } from '../auth/permissions.decorator.js';
import { MediaKind, UserPermission } from '../generated/prisma/client.js';
import { ApiErrorResponseDto } from '../openapi/api-error-response.dto.js';
import { ApiDataResponse } from '../openapi/api-data-response.decorator.js';
import { ArticleService } from './article.service.js';
import { ArticleAssetUploadDto } from './dto/article-asset-upload.dto.js';
import { CreateArticleDto } from './dto/create-article.dto.js';
import { CreateBannerDto } from './dto/create-banner.dto.js';
import { CreateTaxonomyDto } from './dto/create-taxonomy.dto.js';
import {
  ArticleBannerResponseDto,
  CreatedArticleResponseDto,
  MediaAssetResponseDto,
  TaxonomyResponseDto,
} from './dto/article-response.dto.js';

const uploadOptions = { limits: { fileSize: 5 * 1024 * 1024, files: 1 } };

@Controller('cms')
@UseGuards(AccessGuard)
@Permissions(UserPermission.CMS_ACCESS)
@ApiBearerAuth()
@ApiUnauthorizedResponse({
  type: ApiErrorResponseDto,
  description: 'Missing or invalid access token',
})
@ApiForbiddenResponse({
  type: ApiErrorResponseDto,
  description: 'CMS access required',
})
export class ArticleController {
  constructor(private readonly articles: ArticleService) {}

  @Post('articles/assets')
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

  @Get('categories')
  @ApiTags('Article taxonomy')
  @ApiOperation({ summary: 'List article categories for the CMS form' })
  @ApiDataResponse(200, TaxonomyResponseDto, true)
  listCategories() {
    return this.articles.listCategories();
  }

  @Post('categories')
  @ApiTags('Article taxonomy')
  @ApiOperation({ summary: 'Create an article category' })
  @ApiDataResponse(201, TaxonomyResponseDto)
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiConflictResponse({ type: ApiErrorResponseDto })
  createCategory(@Body() input: CreateTaxonomyDto) {
    return this.articles.createCategory(input);
  }

  @Get('tags')
  @ApiTags('Article taxonomy')
  @ApiOperation({ summary: 'List article tags for the CMS form' })
  @ApiDataResponse(200, TaxonomyResponseDto, true)
  listTags() {
    return this.articles.listTags();
  }

  @Post('tags')
  @ApiTags('Article taxonomy')
  @ApiOperation({ summary: 'Create an article tag' })
  @ApiDataResponse(201, TaxonomyResponseDto)
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiConflictResponse({ type: ApiErrorResponseDto })
  createTag(@Body() input: CreateTaxonomyDto) {
    return this.articles.createTag(input);
  }

  @Get('banners')
  @ApiTags('Article banners')
  @ApiOperation({ summary: 'List reusable article banners' })
  @ApiDataResponse(200, ArticleBannerResponseDto, true)
  listBanners() {
    return this.articles.listBanners();
  }

  @Post('banners')
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

  @Post('articles')
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
