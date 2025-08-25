import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTenantDto {
  @ApiProperty({
    description: 'Full name of the tenant',
    example: 'John Doe',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Phone number of the tenant',
    example: '+1234567890',
    required: false,
    maxLength: 20,
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone_number?: string;

  @ApiProperty({
    description: 'National ID number of the tenant',
    example: '987654321',
    required: false,
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  nid?: string;

  @ApiProperty({
    description: 'URL to tenant photo',
    example: 'https://example.com/photos/tenant1.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  photo_url?: string;

  @ApiProperty({
    description: 'Utility meter number assigned to tenant',
    example: 'M-12345',
    required: false,
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  meter_number?: string;

  @ApiProperty({
    description: 'Whether the tenant is currently active',
    example: true,
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean = true;

  @ApiProperty({
    description:
      'Advance payment amount (overpaid amount that carries over to future bills)',
    example: 1000,
    default: 0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  advance_payment?: number = 0;

  @ApiProperty({
    description:
      'Security deposit amount paid at the start of tenancy (refundable at end of tenure)',
    example: 2000,
    default: 0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  security_deposit?: number = 0;

  @ApiProperty({
    description: 'Whether water bill is enabled for this tenant',
    example: true,
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  water_bill_enabled?: boolean = true;

  @ApiProperty({
    description: 'Whether gas bill is enabled for this tenant',
    example: true,
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  gas_bill_enabled?: boolean = true;

  @ApiProperty({
    description: 'Whether electricity bill is enabled for this tenant',
    example: true,
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  electricity_bill_enabled?: boolean = true;

  @ApiProperty({
    description: 'Whether internet bill is enabled for this tenant',
    example: true,
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  internet_bill_enabled?: boolean = true;

  @ApiProperty({
    description: 'Whether service charge is enabled for this tenant',
    example: true,
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  service_charge_enabled?: boolean = true;

  @ApiProperty({
    description: 'ID of the apartment associated with this tenant',
    example: 42,
  })
  @IsNumber()
  apartment_id: number;
}
