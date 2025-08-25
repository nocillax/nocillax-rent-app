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
import { BillsService } from './bills.service';
import { BillGenerationService } from './bill-generation.service';
import { Bill } from '../entities/bill.entity';
import { OtherCharge } from '../entities/other-charge.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateBillDto } from '../dto/bill/create-bill.dto';
import { UpdateBillDto } from '../dto/bill/update-bill.dto';
import { OtherChargeDto } from '../dto/bill/other-charge.dto';

@Controller('bills')
@UseGuards(JwtAuthGuard)
export class BillsController {
  constructor(
    private readonly billsService: BillsService,
    private readonly billGenerationService: BillGenerationService,
  ) {}

  @Get()
  findAll(
    @Query('tenantId') tenantId?: number,
    @Query('year') year?: number,
    @Query('month') month?: number,
  ): Promise<Bill[]> {
    return this.billsService.findAll(tenantId, year, month);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Bill> {
    const bill = await this.billsService.findOne(id);
    if (!bill) {
      throw new HttpException('Bill not found', HttpStatus.NOT_FOUND);
    }
    return bill;
  }

  @Post()
  create(@Body() createBillDto: CreateBillDto): Promise<Bill> {
    return this.billsService.create(createBillDto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBillDto: UpdateBillDto,
  ): Promise<Bill> {
    const updated = await this.billsService.update(id, updateBillDto);
    if (!updated) {
      throw new HttpException('Bill not found', HttpStatus.NOT_FOUND);
    }
    return updated;
  }

  @Post(':id/paid')
  async markAsPaid(@Param('id', ParseIntPipe) id: number): Promise<Bill> {
    const updated = await this.billsService.markAsPaid(id);
    if (!updated) {
      throw new HttpException('Bill not found', HttpStatus.NOT_FOUND);
    }
    return updated;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const result = await this.billsService.remove(id);
    if (!result) {
      throw new HttpException('Bill not found', HttpStatus.NOT_FOUND);
    }
  }

  @Post('generate')
  async generateBills(
    @Query('year') year: number,
    @Query('month') month: number,
  ): Promise<Bill[]> {
    if (!year || !month) {
      throw new HttpException(
        'Year and month are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return await this.billGenerationService.generateBillsForMonth(
        year,
        month,
      );
    } catch (error) {
      throw new HttpException(
        `Failed to generate bills: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':id/other-charges')
  async addOtherCharge(
    @Param('id', ParseIntPipe) id: number,
    @Body() otherChargeDto: OtherChargeDto,
  ): Promise<Bill> {
    const bill = await this.billsService.findOne(id);
    if (!bill) {
      throw new HttpException('Bill not found', HttpStatus.NOT_FOUND);
    }

    try {
      return await this.billsService.addOtherCharge(id, otherChargeDto);
    } catch (error) {
      throw new HttpException(
        `Failed to add other charge: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':billId/other-charges/:chargeId')
  async removeOtherCharge(
    @Param('billId', ParseIntPipe) billId: number,
    @Param('chargeId', ParseIntPipe) chargeId: number,
  ): Promise<void> {
    try {
      const result = await this.billsService.removeOtherCharge(
        billId,
        chargeId,
      );
      if (!result) {
        throw new HttpException('Charge not found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      throw new HttpException(
        `Failed to remove other charge: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
