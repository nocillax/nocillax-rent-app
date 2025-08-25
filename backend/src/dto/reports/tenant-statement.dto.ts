import { IsNumber, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class TenantStatementDto {
  @IsNumber()
  @Type(() => Number)
  tenantId: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
