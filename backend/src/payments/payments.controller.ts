import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  HttpStatus,
  HttpException,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Payment } from '../entities/payment.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePaymentDto } from '../dto/payment/create-payment.dto';
import { UpdatePaymentDto } from '../dto/payment/update-payment.dto';
import { PaymentHistoryDto } from '../dto/payment/payment-history.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('payments')
@ApiBearerAuth()
@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @ApiOperation({
    summary: 'Get all payments',
    description: 'Retrieves all payments with optional filtering',
  })
  @ApiQuery({
    name: 'tenantId',
    required: false,
    description: 'Filter payments by tenant ID',
    type: Number,
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Filter payments after this date (YYYY-MM-DD)',
    type: String,
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Filter payments before this date (YYYY-MM-DD)',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Payments retrieved successfully',
    type: [Payment],
  })
  @Get()
  findAll(
    @Query('tenantId') tenantId?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<Payment[]> {
    const startDateObj = startDate ? new Date(startDate) : undefined;
    const endDateObj = endDate ? new Date(endDate) : undefined;

    return this.paymentsService.findAll(tenantId, startDateObj, endDateObj);
  }

  @ApiOperation({
    summary: 'Get payment by ID',
    description: 'Retrieves a specific payment by its ID',
  })
  @ApiParam({ name: 'id', description: 'Payment ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Payment retrieved successfully',
    type: Payment,
  })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Payment> {
    const payment = await this.paymentsService.findOne(id);
    if (!payment) {
      throw new HttpException('Payment not found', HttpStatus.NOT_FOUND);
    }
    return payment;
  }

  @ApiOperation({
    summary: 'Get total payments for a tenant',
    description: 'Calculates the sum of all payments made by a specific tenant',
  })
  @ApiParam({ name: 'tenantId', description: 'Tenant ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Total payment amount retrieved',
    schema: { properties: { total: { type: 'number', example: 5000.0 } } },
  })
  @Get('tenant/:tenantId/total')
  async getTotalPaymentsByTenant(
    @Param('tenantId', ParseIntPipe) tenantId: number,
  ): Promise<{ total: number }> {
    const total =
      await this.paymentsService.getTotalPaymentsByTenantId(tenantId);
    return { total };
  }

  @ApiOperation({
    summary: 'Get payment history for a tenant',
    description:
      'Retrieves the payment history for a specific tenant with calculated balances',
  })
  @ApiParam({ name: 'tenantId', description: 'Tenant ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Payment history retrieved successfully',
    type: [PaymentHistoryDto],
  })
  @Get('tenant/:tenantId/history')
  async getTenantPaymentHistory(
    @Param('tenantId', ParseIntPipe) tenantId: number,
  ): Promise<PaymentHistoryDto[]> {
    return this.paymentsService.getTenantPaymentHistory(tenantId);
  }

  @ApiOperation({
    summary: 'Get monthly payment summary',
    description:
      'Retrieves a summary of all payments for a specific month and year',
  })
  @ApiQuery({
    name: 'year',
    required: true,
    description: 'Year (e.g. 2025)',
    type: Number,
  })
  @ApiQuery({
    name: 'month',
    required: true,
    description: 'Month (1-12)',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Monthly payment summary retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Year and month are required' })
  @Get('summary/monthly')
  getMonthlyPaymentSummary(
    @Query('year') year: number,
    @Query('month') month: number,
  ): Promise<any[]> {
    if (!year || !month) {
      throw new HttpException(
        'Year and month are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.paymentsService.getMonthlyPaymentSummary(year, month);
  }

  @ApiOperation({
    summary: 'Create a new payment',
    description: 'Records a new payment made by a tenant',
  })
  @ApiBody({ type: CreatePaymentDto, description: 'Payment details' })
  @ApiResponse({
    status: 201,
    description: 'Payment created successfully',
    type: Payment,
  })
  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto): Promise<Payment> {
    return this.paymentsService.create(createPaymentDto);
  }

  @ApiOperation({
    summary: 'Update a payment',
    description: 'Updates an existing payment record',
  })
  @ApiParam({ name: 'id', description: 'Payment ID', type: Number })
  @ApiBody({ type: UpdatePaymentDto, description: 'Updated payment details' })
  @ApiResponse({
    status: 200,
    description: 'Payment updated successfully',
    type: Payment,
  })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment> {
    const updated = await this.paymentsService.update(id, updatePaymentDto);
    if (!updated) {
      throw new HttpException('Payment not found', HttpStatus.NOT_FOUND);
    }
    return updated;
  }

  @ApiOperation({
    summary: 'Delete a payment',
    description: 'Removes a payment record from the system',
  })
  @ApiParam({ name: 'id', description: 'Payment ID', type: Number })
  @ApiResponse({ status: 200, description: 'Payment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const result = await this.paymentsService.remove(id);
    if (!result) {
      throw new HttpException('Payment not found', HttpStatus.NOT_FOUND);
    }
  }
}
