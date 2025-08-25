import { ApiProperty } from '@nestjs/swagger';

export class TenantPaymentStatusDto {
  @ApiProperty({ description: 'Tenant ID', example: 42 })
  tenantId: number;

  @ApiProperty({ description: 'Tenant name', example: 'John Doe' })
  tenantName: string;

  @ApiProperty({
    description: 'Total bill amount for the tenant',
    example: 1500,
  })
  billAmount: number;

  @ApiProperty({ description: 'Amount paid by the tenant', example: 1000 })
  paidAmount: number;

  @ApiProperty({ description: 'Remaining amount due', example: 500 })
  remainingAmount: number;

  @ApiProperty({
    description: 'Payment status',
    example: 'Partial',
    enum: ['Paid', 'Due', 'Partial'],
  })
  status: 'Paid' | 'Due' | 'Partial';

  @ApiProperty({
    description: 'Days since last payment (null if no payments)',
    example: 15,
    nullable: true,
  })
  daysSinceLastPayment: number | null;
}

export class MonthlyDataDto {
  @ApiProperty({ description: 'Month (1-12)', example: 8 })
  month: number;

  @ApiProperty({
    description: 'Total expected revenue for the month',
    example: 15000,
  })
  totalExpected: number;

  @ApiProperty({
    description: 'Total collected revenue for the month',
    example: 13500,
  })
  totalCollected: number;

  @ApiProperty({
    description: 'Outstanding amount for the month',
    example: 1500,
  })
  outstanding: number;
}

export class FinancialSummaryDto {
  @ApiProperty({ description: 'Year of the financial summary', example: 2025 })
  year: number;

  @ApiProperty({
    description: 'Month of the financial summary (1-12)',
    example: 8,
  })
  month: number;

  @ApiProperty({
    description: 'Total expected revenue for the month',
    example: 15000,
  })
  totalExpected: number;

  @ApiProperty({
    description: 'Total amount collected for the month',
    example: 13500,
  })
  totalCollected: number;

  @ApiProperty({ description: 'Outstanding amount still due', example: 1500 })
  outstanding: number;

  @ApiProperty({
    description: 'Percentage of expected revenue collected',
    example: 90,
  })
  collectionRate: number;

  @ApiProperty({
    description: 'Payment status for each tenant',
    type: [TenantPaymentStatusDto],
  })
  tenantPaymentStatuses: TenantPaymentStatusDto[];
}

export class YearlySummaryDto {
  @ApiProperty({ description: 'Year of the summary', example: 2025 })
  year: number;

  @ApiProperty({
    description: 'Monthly data for the entire year',
    type: [MonthlyDataDto],
  })
  months: MonthlyDataDto[];

  @ApiProperty({
    description: 'Total expected revenue for the year',
    example: 180000,
  })
  yearTotalExpected: number;

  @ApiProperty({
    description: 'Total collected revenue for the year',
    example: 165000,
  })
  yearTotalCollected: number;
}
