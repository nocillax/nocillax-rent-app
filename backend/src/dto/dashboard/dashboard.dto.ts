export class FinancialSummaryDto {
  year: number;
  month: number;
  totalExpected: number;
  totalCollected: number;
  outstanding: number;
  collectionRate: number;
  tenantPaymentStatuses: TenantPaymentStatusDto[];
}

export class TenantPaymentStatusDto {
  tenantId: number;
  tenantName: string;
  billAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: 'Paid' | 'Due' | 'Partial';
  daysSinceLastPayment: number | null;
}

export class YearlySummaryDto {
  year: number;
  months: MonthlyDataDto[];
  yearTotalExpected: number;
  yearTotalCollected: number;
}

export class MonthlyDataDto {
  month: number;
  totalExpected: number;
  totalCollected: number;
  outstanding: number;
}
