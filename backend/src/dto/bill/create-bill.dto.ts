import {
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
  Max,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBillDto {
  @IsNumber()
  @Min(1)
  @Max(12)
  month: number;

  @IsNumber()
  @Min(2000)
  year: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  previous_balance: number = 0;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  advance_payment: number = 0;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  rent: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  water_bill: number = 0;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  gas_bill: number = 0;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  electricity_bill: number = 0; // no need

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  internet_bill: number = 0;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  trash_bill: number = 0;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  service_charge: number = 0;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  other_charges: number = 0;

  @IsBoolean()
  @IsOptional()
  is_paid: boolean = false;

  @IsDateString()
  @IsOptional()
  due_date?: string;

  @IsNumber()
  tenant_id: number;

  @IsNumber()
  apartment_id: number;
}
