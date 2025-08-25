import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  MaxLength,
} from 'class-validator';

export class CreateTenantDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone_number?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  nid?: string;

  @IsString()
  @IsOptional()
  photo_url?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  meter_number?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean = true;

  @IsNumber()
  @IsOptional()
  advance_payment?: number = 0;

  @IsBoolean()
  @IsOptional()
  water_bill_enabled?: boolean = true;

  @IsBoolean()
  @IsOptional()
  gas_bill_enabled?: boolean = true;

  @IsBoolean()
  @IsOptional()
  electricity_bill_enabled?: boolean = true;

  @IsBoolean()
  @IsOptional()
  internet_bill_enabled?: boolean = true;

  @IsBoolean()
  @IsOptional()
  service_charge_enabled?: boolean = true;

  @IsNumber()
  apartment_id: number;
}
