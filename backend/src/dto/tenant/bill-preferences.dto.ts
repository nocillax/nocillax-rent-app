import { IsBoolean, IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class TenantBillPreferencesDto {
  @IsBoolean()
  @IsOptional()
  water_bill_enabled?: boolean;

  @IsBoolean()
  @IsOptional()
  gas_bill_enabled?: boolean;

  @IsBoolean()
  @IsOptional()
  electricity_bill_enabled?: boolean;

  @IsBoolean()
  @IsOptional()
  internet_bill_enabled?: boolean;

  @IsBoolean()
  @IsOptional()
  service_charge_enabled?: boolean;

  @IsBoolean()
  @IsOptional()
  trash_bill_enabled?: boolean;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  advance_payment?: number;
}
