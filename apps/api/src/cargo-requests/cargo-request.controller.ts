import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserRole } from '../generated/prisma/client.js';
import { AccessGuard, type AuthenticatedRequest } from '../auth/auth.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { ApiDataResponse } from '../openapi/api-data-response.decorator.js';
import { ApiErrorResponseDto } from '../openapi/api-error-response.dto.js';
import { CargoRequestDto } from './dto/cargo-request.dto.js';
import { CargoRequestResponseDto } from './dto/cargo-request-response.dto.js';
import { ReviewCargoRequestDto } from './dto/review-cargo-request.dto.js';
import { StaffCargoRequestQueryDto } from './dto/staff-cargo-request-query.dto.js';
import { CargoRequestService } from './cargo-request.service.js';

@Controller('cargo-requests')
@UseGuards(AccessGuard)
@Roles(UserRole.CUSTOMER)
@ApiTags('Cargo requests')
@ApiBearerAuth()
@ApiUnauthorizedResponse({
  type: ApiErrorResponseDto,
  description: 'Missing or invalid access token',
})
@ApiForbiddenResponse({
  type: ApiErrorResponseDto,
  description: 'Customer access required',
})
export class CargoRequestController {
  constructor(private readonly cargoRequests: CargoRequestService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a cargo request for review' })
  @ApiDataResponse(201, CargoRequestResponseDto)
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  create(@Req() request: AuthenticatedRequest, @Body() input: CargoRequestDto) {
    return this.cargoRequests.create(request.authUser.id, input);
  }

  @Get()
  @ApiOperation({ summary: 'List my cargo requests' })
  @ApiDataResponse(200, CargoRequestResponseDto, true)
  list(@Req() request: AuthenticatedRequest) {
    return this.cargoRequests.listForCustomer(request.authUser.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get my cargo request' })
  @ApiDataResponse(200, CargoRequestResponseDto)
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiNotFoundResponse({ type: ApiErrorResponseDto })
  get(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.cargoRequests.getForCustomer(request.authUser.id, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Resubmit a cargo request after revision' })
  @ApiDataResponse(200, CargoRequestResponseDto)
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiNotFoundResponse({ type: ApiErrorResponseDto })
  @ApiConflictResponse({ type: ApiErrorResponseDto })
  resubmit(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() input: CargoRequestDto,
  ) {
    return this.cargoRequests.resubmit(request.authUser.id, id, input);
  }
}

@Controller('staff/cargo-requests')
@UseGuards(AccessGuard)
@Roles(UserRole.STAFF)
@ApiTags('Staff cargo requests')
@ApiBearerAuth()
@ApiUnauthorizedResponse({
  type: ApiErrorResponseDto,
  description: 'Missing or invalid access token',
})
@ApiForbiddenResponse({
  type: ApiErrorResponseDto,
  description: 'Staff access required',
})
export class StaffCargoRequestController {
  constructor(private readonly cargoRequests: CargoRequestService) {}

  @Get()
  @ApiOperation({ summary: 'List cargo requests for staff review' })
  @ApiDataResponse(200, CargoRequestResponseDto, true)
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  list(@Query() query: StaffCargoRequestQueryDto) {
    return this.cargoRequests.listForStaff(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a cargo request for staff review' })
  @ApiDataResponse(200, CargoRequestResponseDto)
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiNotFoundResponse({ type: ApiErrorResponseDto })
  get(@Param('id', ParseUUIDPipe) id: string) {
    return this.cargoRequests.getForStaff(id);
  }

  @Post(':id/review')
  @ApiOperation({
    summary: 'Approve, request revision, or reject a cargo request',
  })
  @ApiDataResponse(201, CargoRequestResponseDto)
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiNotFoundResponse({ type: ApiErrorResponseDto })
  @ApiConflictResponse({ type: ApiErrorResponseDto })
  review(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() request: AuthenticatedRequest,
    @Body() input: ReviewCargoRequestDto,
  ) {
    return this.cargoRequests.review(id, request.authUser.id, input);
  }
}
