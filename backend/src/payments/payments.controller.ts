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

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

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

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Payment> {
    const payment = await this.paymentsService.findOne(id);
    if (!payment) {
      throw new HttpException('Payment not found', HttpStatus.NOT_FOUND);
    }
    return payment;
  }

  @Get('tenant/:tenantId/total')
  async getTotalPaymentsByTenant(
    @Param('tenantId', ParseIntPipe) tenantId: number,
  ): Promise<{ total: number }> {
    const total =
      await this.paymentsService.getTotalPaymentsByTenantId(tenantId);
    return { total };
  }

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

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto): Promise<Payment> {
    return this.paymentsService.create(createPaymentDto);
  }

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

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const result = await this.paymentsService.remove(id);
    if (!result) {
      throw new HttpException('Payment not found', HttpStatus.NOT_FOUND);
    }
  }
}
