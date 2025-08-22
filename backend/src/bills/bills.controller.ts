import { Controller, Get, Post, Body, Param, Patch, Delete, HttpStatus, HttpException, Query } from '@nestjs/common';
import { BillsService } from './bills.service';
import { Bill } from '../entities/bill.entity';

@Controller('bills')
export class BillsController {
  constructor(private readonly billsService: BillsService) {}

  @Get()
  findAll(
    @Query('tenantId') tenantId?: number,
    @Query('year') year?: number,
    @Query('month') month?: number,
  ): Promise<Bill[]> {
    return this.billsService.findAll(tenantId, year, month);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Bill> {
    const bill = await this.billsService.findOne(id);
    if (!bill) {
      throw new HttpException('Bill not found', HttpStatus.NOT_FOUND);
    }
    return bill;
  }

  @Post()
  create(@Body() bill: Bill): Promise<Bill> {
    return this.billsService.create(bill);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() bill: Partial<Bill>): Promise<Bill> {
    const updated = await this.billsService.update(id, bill);
    if (!updated) {
      throw new HttpException('Bill not found', HttpStatus.NOT_FOUND);
    }
    return updated;
  }

  @Post(':id/paid')
  async markAsPaid(@Param('id') id: number): Promise<Bill> {
    const updated = await this.billsService.markAsPaid(id);
    if (!updated) {
      throw new HttpException('Bill not found', HttpStatus.NOT_FOUND);
    }
    return updated;
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    const result = await this.billsService.remove(id);
    if (!result) {
      throw new HttpException('Bill not found', HttpStatus.NOT_FOUND);
    }
  }
}
