import { Injectable } from '@nestjs/common';
import { BillsService } from '../bills/bills.service';
import { PaymentsService } from '../payments/payments.service';
import {
  FinancialSummaryDto,
  TenantPaymentStatusDto,
  YearlySummaryDto,
} from '../dto/dashboard/dashboard.dto';

@Injectable()
export class DashboardService {
  constructor(
    private readonly billsService: BillsService,
    private readonly paymentsService: PaymentsService,
  ) {}

  /**
   * Get financial summary for a specific month
   * @param year The year for the financial summary
   * @param month The month for the financial summary (1-12)
   */
  async getFinancialSummary(
    year: number = new Date().getFullYear(),
    month: number = new Date().getMonth() + 1,
  ): Promise<FinancialSummaryDto> {
    // Get all bills for the specified month
    const bills = await this.billsService.findAll(null, year, month);

    // Calculate expected rent total
    const totalExpected = bills.reduce(
      (sum, bill) => sum + Number(bill.total),
      0,
    );

    // Get total collected for the month
    const payments = await this.paymentsService.getMonthlyPaymentSummary(
      year,
      month,
    );
    const totalCollected = payments.reduce(
      (sum, payment) => sum + Number(payment.totalAmount),
      0,
    );

    // Calculate outstanding dues
    const outstanding = totalExpected - totalCollected;

    // Get tenant payment statuses
    const tenantStatuses = await this.getTenantPaymentStatuses(bills, payments);

    return {
      year,
      month,
      totalExpected,
      totalCollected,
      outstanding,
      collectionRate:
        totalExpected > 0 ? (totalCollected / totalExpected) * 100 : 0,
      tenantPaymentStatuses: tenantStatuses,
    };
  }

  /**
   * Get payment status for all tenants in a specific month
   * @param year The year for tenant statuses
   * @param month The month for tenant statuses (1-12)
   */
  async getTenantStatuses(
    year: number = new Date().getFullYear(),
    month: number = new Date().getMonth() + 1,
  ): Promise<TenantPaymentStatusDto[]> {
    // Get all bills for the specified month
    const bills = await this.billsService.findAll(null, year, month);

    // Get all payments for the month
    const payments = await this.paymentsService.getMonthlyPaymentSummary(
      year,
      month,
    );

    // Calculate tenant payment statuses
    return await this.getTenantPaymentStatuses(bills, payments);
  }

  /**
   * Get yearly financial summary with month-by-month breakdown
   * @param year The year for the summary
   */
  async getYearlySummary(
    year: number = new Date().getFullYear(),
  ): Promise<YearlySummaryDto> {
    const monthlyData = [];

    // Get data for each month
    for (let month = 1; month <= 12; month++) {
      // Get bills for the month
      const bills = await this.billsService.findAll(null, year, month);
      const totalExpected = bills.reduce(
        (sum, bill) => sum + Number(bill.total),
        0,
      );

      // Get payments for the month
      const payments = await this.paymentsService.getMonthlyPaymentSummary(
        year,
        month,
      );
      const totalCollected = payments.reduce(
        (sum, payment) => sum + Number(payment.totalAmount),
        0,
      );

      monthlyData.push({
        month,
        totalExpected,
        totalCollected,
        outstanding: totalExpected - totalCollected,
      });
    }

    return {
      year,
      months: monthlyData,
      yearTotalExpected: monthlyData.reduce(
        (sum, month) => sum + month.totalExpected,
        0,
      ),
      yearTotalCollected: monthlyData.reduce(
        (sum, month) => sum + month.totalCollected,
        0,
      ),
    };
  }

  /**
   * Calculate payment status for each tenant
   * @param bills List of bills
   * @param payments List of payments
   */
  async getTenantPaymentStatuses(
    bills: any[],
    payments: any[],
  ): Promise<TenantPaymentStatusDto[]> {
    const tenantMap = new Map();

    // Process all bills
    for (const bill of bills) {
      tenantMap.set(bill.tenant_id, {
        tenantId: bill.tenant_id,
        tenantName: bill.tenant?.name || `Tenant #${bill.tenant_id}`,
        billAmount: Number(bill.total),
        paidAmount: 0,
        status: 'Unpaid', // Default status
        daysSinceLastPayment: null,
      });
    }

    // Process all payments
    for (const payment of payments) {
      const tenantId = payment.tenantId;
      if (tenantMap.has(tenantId)) {
        const tenant = tenantMap.get(tenantId);
        tenant.paidAmount += Number(payment.totalAmount);
      }
    }

    // Calculate final statuses
    const statuses = [];
    for (const [_, tenant] of tenantMap) {
      // Calculate remaining amount
      const remaining = tenant.billAmount - tenant.paidAmount;

      // Determine status
      if (remaining <= 0) {
        tenant.status = 'Paid';
      } else if (tenant.paidAmount > 0) {
        tenant.status = 'Partial';
      } else {
        tenant.status = 'Due';
      }

      tenant.remainingAmount = Math.max(0, remaining);
      statuses.push(tenant);
    }

    return statuses;
  }
}
