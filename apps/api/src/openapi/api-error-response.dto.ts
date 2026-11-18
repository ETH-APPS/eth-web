import { ApiProperty } from '@nestjs/swagger';
import { ApiErrorDetailDto } from './api-error-detail.dto.js';

export class ApiErrorResponseDto {
  @ApiProperty({ example: '0f24a86d-37d4-4bb5-a987-042d79430376' })
  request_id!: string;

  @ApiProperty({ type: () => ApiErrorDetailDto })
  error!: ApiErrorDetailDto;
}
