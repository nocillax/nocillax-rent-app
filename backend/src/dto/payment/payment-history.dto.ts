import { IsNumber, IsDate, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class PaymentHistoryDto {
  @IsNumber()
  payment_id: number;

  @IsDate()
  date: Date;

  @IsNumber()
  amount: number;

  @IsNumber()
  remaining_balance: number;

  @IsString()
  @IsOptional()
  payment_method?: string;

  @IsString()
  @IsOptional()
  reference_number?: string;
}
