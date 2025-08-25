import { IsNumber, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class MonthlyReportDto {
  @IsNumber()
  @Min(2000)
  @Type(() => Number)
  year: number;

  @IsNumber()
  @Min(1)
  @Max(12)
  @Type(() => Number)
  month: number;
}
