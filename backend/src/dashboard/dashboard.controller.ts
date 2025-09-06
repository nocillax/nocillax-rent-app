import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  FinancialSummaryDto,
  TenantPaymentStatusDto,
  YearlySummaryDto,
} from '../dto/dashboard/dashboard.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@ApiBearerAuth('JWT-auth')
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOperation({ summary: 'Get financial summary for a specific month' })
  @ApiResponse({
    status: 200,
    description:
      'Returns financial summary including collection rates and tenant payment statuses',
    type: FinancialSummaryDto,
  })
  @ApiQuery({
    name: 'year',
    required: false,
    description: 'Year for the financial summary (defaults to current year)',
    type: Number,
  })
  @ApiQuery({
    name: 'month',
    required: false,
    description:
      'Month for the financial summary (1-12, defaults to current month)',
    type: Number,
  })
  @Get('financial-summary')
  async getFinancialSummary(
    @Query('year') year: number = new Date().getFullYear(),
    @Query('month') month: number = new Date().getMonth() + 1,
  ): Promise<FinancialSummaryDto> {
    return this.dashboardService.getFinancialSummary(year, month);
  }

  @ApiOperation({
    summary: 'Get payment status for all tenants in a specific month',
  })
  @ApiResponse({
    status: 200,
    description:
      'Returns payment status for each tenant (paid, partial, or due)',
    type: [TenantPaymentStatusDto],
  })
  @ApiQuery({
    name: 'year',
    required: false,
    description: 'Year for tenant statuses (defaults to current year)',
    type: Number,
  })
  @ApiQuery({
    name: 'month',
    required: false,
    description: 'Month for tenant statuses (1-12, defaults to current month)',
    type: Number,
  })
  @Get('tenant-statuses')
  async getTenantStatuses(
    @Query('year') year: number = new Date().getFullYear(),
    @Query('month') month: number = new Date().getMonth() + 1,
  ): Promise<TenantPaymentStatusDto[]> {
    return this.dashboardService.getTenantStatuses(year, month);
  }

  @ApiOperation({
    summary: 'Get yearly financial summary with month-by-month breakdown',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns yearly financial data with monthly breakdowns',
    type: YearlySummaryDto,
  })
  @ApiQuery({
    name: 'year',
    required: false,
    description: 'Year for the summary (defaults to current year)',
    type: Number,
  })
  @Get('yearly-summary')
  async getYearlySummary(
    @Query('year') year: number = new Date().getFullYear(),
  ): Promise<YearlySummaryDto> {
    return this.dashboardService.getYearlySummary(year);
  }
}
