import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiDataResponse } from '../openapi/api-data-response.decorator.js';
import { ApiErrorResponseDto } from '../openapi/api-error-response.dto.js';
import { UserRole } from '../generated/prisma/client.js';
import { AccessGuard, type AuthenticatedRequest } from './auth.guard.js';
import { Roles } from './roles.decorator.js';
import { AuthTokenResponseDto } from './dto/auth-token-response.dto.js';
import { AuthUserResponseDto } from './dto/auth-user-response.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { GoogleAuthDto } from './dto/google-auth.dto.js';
import { LinkGoogleDto } from './dto/link-google.dto.js';
import { RefreshTokenDto } from './dto/refresh-token.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { AuthService } from './auth.service.js';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a customer account' })
  @ApiDataResponse(201, AuthTokenResponseDto)
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiConflictResponse({
    type: ApiErrorResponseDto,
    description: 'Email is already registered',
  })
  register(@Body() input: RegisterDto) {
    return this.auth.register(input);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in with email and password' })
  @ApiDataResponse(200, AuthTokenResponseDto)
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiUnauthorizedResponse({
    type: ApiErrorResponseDto,
    description: 'Invalid credentials',
  })
  login(@Body() input: LoginDto) {
    return this.auth.login(input);
  }

  @Post('google')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Register or log in a customer with Google' })
  @ApiDataResponse(200, AuthTokenResponseDto)
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ApiErrorResponseDto })
  @ApiConflictResponse({ type: ApiErrorResponseDto })
  @ApiServiceUnavailableResponse({
    type: ApiErrorResponseDto,
    description: 'Google OAuth client ID is not configured',
  })
  googleLogin(@Body() input: GoogleAuthDto) {
    return this.auth.googleLogin(input);
  }

  @Post('google/link')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AccessGuard)
  @Roles(UserRole.CUSTOMER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Link Google to a customer account' })
  @ApiNoContentResponse()
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ApiErrorResponseDto })
  @ApiForbiddenResponse({ type: ApiErrorResponseDto })
  @ApiConflictResponse({ type: ApiErrorResponseDto })
  linkGoogle(
    @Req() request: AuthenticatedRequest,
    @Body() input: LinkGoogleDto,
  ) {
    return this.auth.linkGoogle(request.authUser.id, input.idToken);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rotate a refresh token' })
  @ApiDataResponse(200, AuthTokenResponseDto)
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiUnauthorizedResponse({
    type: ApiErrorResponseDto,
    description: 'Invalid refresh token',
  })
  refresh(@Body() input: RefreshTokenDto) {
    return this.auth.refresh(input.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Revoke a refresh token' })
  @ApiNoContentResponse()
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  logout(@Body() input: RefreshTokenDto) {
    return this.auth.logout(input.refreshToken);
  }

  @Get('me')
  @UseGuards(AccessGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the current account' })
  @ApiDataResponse(200, AuthUserResponseDto)
  @ApiUnauthorizedResponse({
    type: ApiErrorResponseDto,
    description: 'Missing or invalid access token',
  })
  me(@Req() request: AuthenticatedRequest) {
    return request.authUser;
  }
}
