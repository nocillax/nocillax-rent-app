import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BillsService } from '../bills/bills.service';
import { PaymentsService } from '../payments/payments.service';
import {
  FinancialSummaryDto,
  TenantPaymentStatusDto,
  YearlySummaryDto,
} from '../dto/dashboard/dashboard.dto';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(
    private readonly billsService: BillsService,
    private readonly paymentsService: PaymentsService,
  ) {}

  @Get('financial-summary')
  async getFinancialSummary(
    @Query('year') year: number = new Date().getFullYear(),
    @Query('month') month: number = new Date().getMonth() + 1,
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

  @Get('tenant-statuses')
  async getTenantStatuses(
    @Query('year') year: number = new Date().getFullYear(),
    @Query('month') month: number = new Date().getMonth() + 1,
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
   * Calculate payment status for each tenant
   */
  private async getTenantPaymentStatuses(bills: any[], payments: any[]) {
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

  @Get('yearly-summary')
  async getYearlySummary(
    @Query('year') year: number = new Date().getFullYear(),
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
}
