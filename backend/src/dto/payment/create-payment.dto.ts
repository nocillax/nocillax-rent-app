import {
  IsNumber,
  IsString,
  IsDateString,
  IsOptional,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({ description: 'Payment amount', example: 750.5, minimum: 0 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  amount: number;

  @ApiProperty({
    description: 'Date of payment (ISO format)',
    example: '2025-08-15',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiProperty({
    description: 'Additional details about the payment',
    example: 'August rent payment',
    required: false,
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  description?: string;

  @ApiProperty({
    description: 'Method of payment',
    example: 'Credit Card',
    required: false,
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  payment_method?: string;

  @ApiProperty({
    description: 'Reference or transaction number',
    example: 'TRX123456789',
    required: false,
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  reference_number?: string;

  @ApiProperty({
    description: 'Remaining balance after payment',
    example: 250.0,
    required: false,
    minimum: 0,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  remaining_balance?: number;

  @ApiProperty({
    description: 'ID of the tenant making the payment',
    example: 42,
  })
  @IsNumber()
  tenant_id: number;
}
