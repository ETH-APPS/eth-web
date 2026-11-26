import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({ maxLength: 180 })
  @IsString()
  @MinLength(1)
  @MaxLength(180)
  title!: string;

  @ApiProperty({
    example: 'mengenal-cargo-manifest',
    pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
    maxLength: 180,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(180)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug!: string;

  @ApiProperty({ maxLength: 320 })
  @IsString()
  @MinLength(1)
  @MaxLength(320)
  metaDescription!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID('4')
  coverMediaId!: string;

  @ApiProperty({ maxLength: 300 })
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  coverImageAlt!: string;

  @ApiProperty({ description: 'Restricted semantic HTML', maxLength: 500000 })
  @IsString()
  @MinLength(1)
  @MaxLength(500000)
  bodyHtml!: string;

  @ApiProperty({ type: [String], minItems: 1 })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @MaxLength(500, { each: true })
  keyPoints!: string[];

  @ApiProperty({ format: 'uuid' })
  @IsUUID('4')
  categoryId!: string;

  @ApiProperty({ type: [String], format: 'uuid' })
  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  tagIds!: string[];

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID('4')
  bannerId?: string;
}
