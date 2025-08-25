import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  Min,
  MaxLength,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { CreateApartmentDto } from './create-apartment.dto';

// Using PartialType from @nestjs/swagger instead of @nestjs/mapped-types
// to ensure proper Swagger documentation inheritance
export class UpdateApartmentDto extends PartialType(CreateApartmentDto) {}
