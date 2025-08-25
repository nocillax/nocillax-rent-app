import {
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
  Max,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBillDto {
  @ApiProperty({
    description: 'Month number (1-12)',
    example: 8,
    minimum: 1,
    maximum: 12,
  })
  @IsNumber()
  @Min(1)
  @Max(12)
  month: number;

  @ApiProperty({
    description: 'Year of the bill',
    example: 2025,
    minimum: 2000,
  })
  @IsNumber()
  @Min(2000)
  year: number;

  @ApiProperty({
    description: 'Previous unpaid balance carried over from last month',
    example: 150.5,
    minimum: 0,
    default: 0,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  previous_balance: number = 0;

  @ApiProperty({
    description: 'Advance payment to be applied to this bill',
    example: 200,
    minimum: 0,
    default: 0,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  advance_payment: number = 0;

  @ApiProperty({
    description: 'Base rent amount',
    example: 1500,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  rent: number;

  @ApiProperty({
    description: 'Water bill amount',
    example: 45.75,
    minimum: 0,
    default: 0,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  water_bill: number = 0;

  @ApiProperty({
    description: 'Gas bill amount',
    example: 35.25,
    minimum: 0,
    default: 0,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  gas_bill: number = 0;

  @ApiProperty({
    description: 'Electricity bill amount',
    example: 85.5,
    minimum: 0,
    default: 0,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  electricity_bill: number = 0;

  @ApiProperty({
    description: 'Internet bill amount',
    example: 60,
    minimum: 0,
    default: 0,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  internet_bill: number = 0;

  @ApiProperty({
    description: 'Trash collection bill amount',
    example: 25,
    minimum: 0,
    default: 0,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  trash_bill: number = 0;

  @ApiProperty({
    description: 'Building service charge amount',
    example: 100,
    minimum: 0,
    default: 0,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  service_charge: number = 0;

  @ApiProperty({
    description: 'Additional charges not covered by other categories',
    example: 75,
    minimum: 0,
    default: 0,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  other_charges: number = 0;

  @ApiProperty({
    description: 'Whether the bill has been paid',
    example: false,
    default: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_paid: boolean = false;

  @ApiProperty({
    description: 'Due date for the bill payment',
    example: '2025-09-05',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  due_date?: string;

  @ApiProperty({
    description: 'ID of the tenant this bill belongs to',
    example: 42,
  })
  @IsNumber()
  tenant_id: number;

  @ApiProperty({
    description: 'ID of the apartment this bill is for',
    example: 15,
  })
  @IsNumber()
  apartment_id: number;
}
