import {
  IsNumber,
  IsOptional,
  Min,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TenantClosureDto {
  @ApiProperty({
    description: 'Deductions from security deposit (e.g., for damages)',
    example: 250.75,
    required: false,
    default: 0,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  deposit_deductions?: number = 0;

  @ApiProperty({
    description: 'Reason for the deductions from security deposit',
    example: 'Repairs for wall damage in living room',
    required: false,
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  deduction_reason?: string;

  @ApiProperty({
    description: 'Final outstanding balance to be paid by tenant',
    example: 1200.5,
    required: false,
    default: 0,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  final_balance?: number = 0;

  @ApiProperty({
    description:
      'Amount refunded to tenant (from security deposit and/or advance payment)',
    example: 1750.25,
    required: false,
    default: 0,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  refund_amount?: number = 0;
}
