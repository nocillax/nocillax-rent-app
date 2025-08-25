import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateApartmentDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @MaxLength(255)
  address: string;

  @IsNumber()
  @Min(0)
  size: number;

  @IsNumber()
  @Min(1)
  rooms: number;

  @IsNumber()
  @Min(0)
  rent_amount: number;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @IsBoolean()
  @IsOptional()
  is_available?: boolean = true;
}
