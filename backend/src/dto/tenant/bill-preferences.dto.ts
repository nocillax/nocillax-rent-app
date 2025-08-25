import { IsBoolean, IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TenantBillPreferencesDto {
  @ApiProperty({
    description: 'Whether the tenant should receive water bills',
    example: true,
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  water_bill_enabled?: boolean;

  @ApiProperty({
    description: 'Whether the tenant should receive gas bills',
    example: true,
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  gas_bill_enabled?: boolean;

  @ApiProperty({
    description: 'Whether the tenant should receive electricity bills',
    example: true,
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  electricity_bill_enabled?: boolean;

  @ApiProperty({
    description: 'Whether the tenant should receive internet bills',
    example: true,
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  internet_bill_enabled?: boolean;

  @ApiProperty({
    description: 'Whether the tenant should receive service charges',
    example: true,
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  service_charge_enabled?: boolean;

  @ApiProperty({
    description: 'Whether the tenant should receive trash collection bills',
    example: true,
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  trash_bill_enabled?: boolean;

  @ApiProperty({
    description:
      'Amount of advance payment (from overpayment) to be applied to bills',
    example: 500,
    required: false,
    default: 0,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  advance_payment?: number;
}
