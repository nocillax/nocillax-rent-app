import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class OtherChargeDto {
  @ApiProperty({
    description: 'Name of the additional charge',
    example: 'Window Repair',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Amount of the additional charge',
    example: 75.5,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  amount: number;

  @ApiProperty({
    description: 'Optional description of what the charge is for',
    example: 'Repair of broken window in living room',
    maxLength: 255,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  description?: string;
}
