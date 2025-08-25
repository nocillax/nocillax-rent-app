import { PartialType } from '@nestjs/swagger';
import { CreateBillDto } from './create-bill.dto';

// Using PartialType from @nestjs/swagger instead of @nestjs/mapped-types
// to ensure proper Swagger documentation inheritance
export class UpdateBillDto extends PartialType(CreateBillDto) {}
