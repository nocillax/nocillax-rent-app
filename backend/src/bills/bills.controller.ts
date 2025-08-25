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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Bills')
@ApiBearerAuth() // Changed to use the default 'bearer' to match main.ts configuration
@Controller('bills')
@UseGuards(JwtAuthGuard)
export class BillsController {
  constructor(
    private readonly billsService: BillsService,
    private readonly billGenerationService: BillGenerationService,
  ) {}

  @ApiOperation({ summary: 'Get all bills with optional filtering' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of bills',
    type: [Bill],
  })
  @ApiQuery({
    name: 'tenantId',
    required: false,
    description: 'Filter bills by tenant ID',
    type: Number,
  })
  @ApiQuery({
    name: 'year',
    required: false,
    description: 'Filter bills by year',
    type: Number,
  })
  @ApiQuery({
    name: 'month',
    required: false,
    description: 'Filter bills by month (1-12)',
    type: Number,
  })
  @Get()
  findAll(
    @Query('tenantId') tenantId?: number,
    @Query('year') year?: number,
    @Query('month') month?: number,
  ): Promise<Bill[]> {
    return this.billsService.findAll(tenantId, year, month);
  }

  @ApiOperation({ summary: 'Get a bill by ID' })
  @ApiResponse({
    status: 200,
    description: 'The bill has been found',
    type: Bill,
  })
  @ApiResponse({
    status: 404,
    description: 'Bill not found',
  })
  @ApiParam({
    name: 'id',
    description: 'Bill ID',
    type: Number,
  })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Bill> {
    const bill = await this.billsService.findOne(id);
    if (!bill) {
      throw new HttpException('Bill not found', HttpStatus.NOT_FOUND);
    }
    return bill;
  }

  @ApiOperation({ summary: 'Create a new bill' })
  @ApiResponse({
    status: 201,
    description: 'The bill has been created',
    type: Bill,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @Post()
  create(@Body() createBillDto: CreateBillDto): Promise<Bill> {
    return this.billsService.create(createBillDto);
  }

  @ApiOperation({ summary: 'Update a bill by ID' })
  @ApiResponse({
    status: 200,
    description: 'The bill has been updated',
    type: Bill,
  })
  @ApiResponse({
    status: 404,
    description: 'Bill not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiParam({
    name: 'id',
    description: 'Bill ID',
    type: Number,
  })
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

  @ApiOperation({ summary: 'Mark a bill as paid' })
  @ApiResponse({
    status: 200,
    description: 'The bill has been marked as paid',
    type: Bill,
  })
  @ApiResponse({
    status: 404,
    description: 'Bill not found',
  })
  @ApiParam({
    name: 'id',
    description: 'Bill ID',
    type: Number,
  })
  @Post(':id/paid')
  async markAsPaid(@Param('id', ParseIntPipe) id: number): Promise<Bill> {
    const updated = await this.billsService.markAsPaid(id);
    if (!updated) {
      throw new HttpException('Bill not found', HttpStatus.NOT_FOUND);
    }
    return updated;
  }

  @ApiOperation({ summary: 'Delete a bill' })
  @ApiResponse({
    status: 200,
    description: 'The bill has been successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Bill not found',
  })
  @ApiParam({
    name: 'id',
    description: 'Bill ID',
    type: Number,
  })
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const result = await this.billsService.remove(id);
    if (!result) {
      throw new HttpException('Bill not found', HttpStatus.NOT_FOUND);
    }
  }

  @ApiOperation({
    summary: 'Generate bills for all active tenants for a specific month',
  })
  @ApiResponse({
    status: 201,
    description: 'Bills have been generated successfully',
    type: [Bill],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid year or month parameters',
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to generate bills',
  })
  @ApiQuery({
    name: 'year',
    required: true,
    description: 'Year to generate bills for',
    type: Number,
    example: 2025,
  })
  @ApiQuery({
    name: 'month',
    required: true,
    description: 'Month to generate bills for (1-12)',
    type: Number,
    example: 8,
  })
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

  @ApiOperation({ summary: 'Add an additional charge to a bill' })
  @ApiResponse({
    status: 201,
    description: 'The charge has been added successfully',
    type: Bill,
  })
  @ApiResponse({
    status: 404,
    description: 'Bill not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid charge data',
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to add charge',
  })
  @ApiParam({
    name: 'id',
    description: 'Bill ID',
    type: Number,
  })
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

  @ApiOperation({ summary: 'Remove an additional charge from a bill' })
  @ApiResponse({
    status: 200,
    description: 'The charge has been removed successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Bill or charge not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to remove charge',
  })
  @ApiParam({
    name: 'billId',
    description: 'Bill ID',
    type: Number,
  })
  @ApiParam({
    name: 'chargeId',
    description: 'Charge ID to remove',
    type: Number,
  })
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

  @ApiOperation({
    summary: 'Calculate final bill for tenant planning to leave',
    description:
      'This endpoint calculates what the tenant owes for the current month and the total balance ' +
      'after applying their security deposit. Tenants pay for the full month regardless of ' +
      'how many days they stay. If there is no current month bill, it creates a full month ' +
      'bill based on the previous month as a template. The final calculation includes all ' +
      'outstanding bills, security deposit deductions, and potential refunds.',
  })
  @ApiResponse({
    status: 200,
    description: 'Calculated final bill and closure information',
    schema: {
      properties: {
        current_month_bill: {
          type: 'object',
          description:
            'Bill for the current month (either existing or estimated)',
          properties: {
            id: { type: 'number' },
            month: { type: 'number' },
            year: { type: 'number' },
            rent: { type: 'number' },
            water_bill: { type: 'number' },
            gas_bill: { type: 'number' },
            electricity_bill: { type: 'number' },
            internet_bill: { type: 'number' },
            service_charge: { type: 'number' },
            trash_bill: { type: 'number' },
            total: { type: 'number' },
          },
        },
        bill_source: {
          type: 'string',
          example: 'existing',
          description:
            'Whether the current month bill was existing or newly estimated',
        },
        all_unpaid_bills: {
          type: 'array',
          description: 'All unpaid bills for this tenant',
          items: {
            type: 'object',
          },
        },
        total_outstanding: {
          type: 'number',
          example: 3250.5,
          description: 'Total amount due from all unpaid bills',
        },
        advance_payment: {
          type: 'number',
          example: 500,
          description: 'Existing advance payment that can be applied to bills',
        },
        security_deposit: {
          type: 'number',
          example: 2000,
          description: 'Security deposit amount paid by tenant',
        },
        remaining_after_advance: {
          type: 'number',
          example: 2750.5,
          description: 'Remaining balance after applying any advance payment',
        },
        security_deposit_refund: {
          type: 'number',
          example: 0,
          description:
            'Amount to refund to tenant if security deposit exceeds outstanding balance',
        },
        final_amount_due: {
          type: 'number',
          example: 750.5,
          description:
            'Final amount tenant needs to pay after applying security deposit',
        },
        calculation_date: {
          type: 'string',
          format: 'date-time',
          description: 'Date when the calculation was performed',
        },
        message: {
          type: 'string',
          example: 'Using existing bill for current month in final calculation',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Tenant not found',
  })
  @ApiResponse({
    status: 400,
    description: 'No billing history available to create an estimate',
  })
  @ApiParam({
    name: 'tenantId',
    description: 'Tenant ID',
    type: Number,
  })
  @Get('tenant/:tenantId/final-bill')
  async calculateFinalBill(
    @Param('tenantId', ParseIntPipe) tenantId: number,
  ): Promise<any> {
    try {
      return await this.billsService.calculateFinalBillForTenant(tenantId);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to calculate final bill',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
