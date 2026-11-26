import {
  Body,
  Controller,
  Get,
  Post,
  Req,
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
import { AccessGuard, type AuthenticatedRequest } from '../auth/auth.guard.js';
import { Permissions } from '../auth/permissions.decorator.js';
import {
  MediaKind,
  UserPermission,
} from '../generated/prisma/client.js';
import { ApiErrorResponseDto } from '../openapi/api-error-response.dto.js';
import { ApiDataResponse } from '../openapi/api-data-response.decorator.js';
import { CmsService } from './cms.service.js';
import { ArticleAssetUploadDto } from './dto/article-asset-upload.dto.js';
import { CreateArticleDto } from './dto/create-article.dto.js';
import { CreateBannerDto } from './dto/create-banner.dto.js';
import { CreateTaxonomyDto } from './dto/create-taxonomy.dto.js';
import {
  ArticleBannerResponseDto,
  CreatedArticleResponseDto,
  MediaAssetResponseDto,
  TaxonomyResponseDto,
} from './dto/cms-response.dto.js';

const uploadOptions = { limits: { fileSize: 5 * 1024 * 1024, files: 1 } };

@Controller('cms')
@UseGuards(AccessGuard)
@Permissions(UserPermission.CMS_ACCESS)
@ApiTags('CMS articles')
@ApiBearerAuth()
@ApiUnauthorizedResponse({
  type: ApiErrorResponseDto,
  description: 'Missing or invalid access token',
})
@ApiForbiddenResponse({
  type: ApiErrorResponseDto,
  description: 'CMS access required',
})
export class CmsController {
  constructor(private readonly cms: CmsService) {}

  @Post('articles/assets')
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
    @Req() request: AuthenticatedRequest,
    @Body() input: ArticleAssetUploadDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.cms.uploadArticleAsset(request.authUser.id, input.kind, file);
  }

  @Get('categories')
  @ApiOperation({ summary: 'List article categories for the CMS form' })
  @ApiDataResponse(200, TaxonomyResponseDto, true)
  listCategories() {
    return this.cms.listCategories();
  }

  @Post('categories')
  @ApiOperation({ summary: 'Create an article category' })
  @ApiDataResponse(201, TaxonomyResponseDto)
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiConflictResponse({ type: ApiErrorResponseDto })
  createCategory(@Body() input: CreateTaxonomyDto) {
    return this.cms.createCategory(input);
  }

  @Get('tags')
  @ApiOperation({ summary: 'List article tags for the CMS form' })
  @ApiDataResponse(200, TaxonomyResponseDto, true)
  listTags() {
    return this.cms.listTags();
  }

  @Post('tags')
  @ApiOperation({ summary: 'Create an article tag' })
  @ApiDataResponse(201, TaxonomyResponseDto)
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiConflictResponse({ type: ApiErrorResponseDto })
  createTag(@Body() input: CreateTaxonomyDto) {
    return this.cms.createTag(input);
  }

  @Get('banners')
  @ApiOperation({ summary: 'List reusable article banners' })
  @ApiDataResponse(200, ArticleBannerResponseDto, true)
  listBanners() {
    return this.cms.listBanners();
  }

  @Post('banners')
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
    @Req() request: AuthenticatedRequest,
    @Body() input: CreateBannerDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.cms.createBanner(request.authUser.id, input, image);
  }

  @Post('articles')
  @ApiOperation({ summary: 'Create and immediately publish an article' })
  @ApiDataResponse(201, CreatedArticleResponseDto)
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiConflictResponse({ type: ApiErrorResponseDto })
  createArticle(
    @Req() request: AuthenticatedRequest,
    @Body() input: CreateArticleDto,
  ) {
    return this.cms.createArticle(request.authUser.id, input);
  }
}
