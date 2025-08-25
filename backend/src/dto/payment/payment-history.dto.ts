import { IsNumber, IsDate, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaymentHistoryDto {
  @ApiProperty({
    description: 'Unique identifier of the payment',
    example: 42,
  })
  @IsNumber()
  payment_id: number;

  @ApiProperty({
    description: 'Date when the payment was made',
    example: '2025-08-15T00:00:00Z',
  })
  @IsDate()
  date: Date;

  @ApiProperty({
    description: 'Amount paid',
    example: 750.5,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Remaining balance after this payment was applied',
    example: 250.75,
  })
  @IsNumber()
  remaining_balance: number;

  @ApiProperty({
    description: 'Method used for payment',
    example: 'Credit Card',
    required: false,
  })
  @IsString()
  @IsOptional()
  payment_method?: string;

  @ApiProperty({
    description: 'Reference or transaction number',
    example: 'TRX123456789',
    required: false,
  })
  @IsString()
  @IsOptional()
  reference_number?: string;
}
