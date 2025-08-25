import {
  IsNumber,
  IsOptional,
  Min,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ClosurePreviewDto {
  @ApiProperty({
    description:
      'Estimated deductions from security deposit (e.g., for damages)',
    example: 250.75,
    required: false,
    default: 0,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  estimated_deductions?: number = 0;

  @ApiProperty({
    description: 'Reason for the estimated deductions',
    example: 'Repairs for wall damage in living room',
    required: false,
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  deduction_reason?: string;
}
