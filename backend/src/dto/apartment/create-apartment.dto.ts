import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApartmentDto {
  @ApiProperty({
    description: 'Name of the apartment',
    example: 'Sunset Apartment 301',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Physical address of the apartment',
    example: '123 Main Street, Apt 301, Cityville',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  address: string;

  @ApiProperty({
    description: 'Size of the apartment in square feet/meters',
    example: 850,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  size: number;

  @ApiProperty({
    description: 'Number of rooms in the apartment',
    example: 3,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  rooms: number;

  @ApiProperty({
    description: 'Base monthly rent amount',
    example: 1500.0,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  rent_amount: number;

  @ApiProperty({
    description: 'Additional details about the apartment',
    example: 'Corner unit with balcony, good natural light',
    required: false,
    maxLength: 500,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    description: 'Whether the apartment is available for rent',
    example: true,
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  is_available?: boolean = true;
}
