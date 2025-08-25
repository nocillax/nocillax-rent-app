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
import { TenantsService } from './tenants.service';
import { Tenant } from '../entities/tenant.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTenantDto } from '../dto/tenant/create-tenant.dto';
import { UpdateTenantDto } from '../dto/tenant/update-tenant.dto';
import { TenantBillPreferencesDto } from '../dto/tenant/bill-preferences.dto';
import { TenantClosureDto } from '../dto/tenant/tenant-closure.dto';
import { ClosurePreviewDto } from '../dto/tenant/closure-preview.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Tenants')
@ApiBearerAuth('JWT-auth')
@Controller('tenants')
@UseGuards(JwtAuthGuard)
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @ApiOperation({
    summary: 'Get all tenants with optional filtering by apartment',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of tenants',
    type: [Tenant],
  })
  @ApiQuery({
    name: 'apartmentId',
    required: false,
    description: 'Filter tenants by apartment ID',
    type: Number,
  })
  @Get()
  findAll(
    @Query('apartmentId', new ParseIntPipe({ optional: true }))
    apartmentId?: number,
  ): Promise<Tenant[]> {
    return this.tenantsService.findAll(apartmentId);
  }

  @ApiOperation({ summary: 'Get all archived (inactive) tenants' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of archived tenants',
    type: [Tenant],
  })
  @Get('archive')
  findArchived(): Promise<Tenant[]> {
    return this.tenantsService.findArchived();
  }

  @ApiOperation({ summary: 'Get a tenant by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the tenant details',
    type: Tenant,
  })
  @ApiResponse({
    status: 404,
    description: 'Tenant not found',
  })
  @ApiParam({
    name: 'id',
    description: 'Tenant ID',
    type: Number,
  })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Tenant> {
    const tenant = await this.tenantsService.findOne(id);
    if (!tenant) {
      throw new HttpException('Tenant not found', HttpStatus.NOT_FOUND);
    }
    return tenant;
  }

  @ApiOperation({ summary: 'Get all bills for a specific tenant' })
  @ApiResponse({
    status: 200,
    description: "Returns a list of tenant's bills",
    type: [Object],
  })
  @ApiResponse({
    status: 404,
    description: 'Tenant not found',
  })
  @ApiParam({
    name: 'id',
    description: 'Tenant ID',
    type: Number,
  })
  @Get(':id/bills')
  async findBills(@Param('id') id: number): Promise<any[]> {
    const tenant = await this.tenantsService.findOne(id);
    if (!tenant) {
      throw new HttpException('Tenant not found', HttpStatus.NOT_FOUND);
    }
    return this.tenantsService.findBills(id);
  }

  @ApiOperation({ summary: 'Get all payments for a specific tenant' })
  @ApiResponse({
    status: 200,
    description: "Returns a list of tenant's payments",
    type: [Object],
  })
  @ApiResponse({
    status: 404,
    description: 'Tenant not found',
  })
  @ApiParam({
    name: 'id',
    description: 'Tenant ID',
    type: Number,
  })
  @Get(':id/payments')
  async findPayments(@Param('id') id: number): Promise<any[]> {
    const tenant = await this.tenantsService.findOne(id);
    if (!tenant) {
      throw new HttpException('Tenant not found', HttpStatus.NOT_FOUND);
    }
    return this.tenantsService.findPayments(id);
  }

  @ApiOperation({ summary: 'Create a new tenant' })
  @ApiResponse({
    status: 201,
    description: 'The tenant has been successfully created',
    type: Tenant,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or apartment not found',
  })
  @Post()
  create(@Body() createTenantDto: CreateTenantDto): Promise<Tenant> {
    return this.tenantsService.create(createTenantDto);
  }

  @ApiOperation({ summary: 'Update a tenant by ID' })
  @ApiResponse({
    status: 200,
    description: 'The tenant has been successfully updated',
    type: Tenant,
  })
  @ApiResponse({
    status: 404,
    description: 'Tenant not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or apartment not found',
  })
  @ApiParam({
    name: 'id',
    description: 'Tenant ID',
    type: Number,
  })
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTenantDto: UpdateTenantDto,
  ): Promise<Tenant> {
    const updated = await this.tenantsService.update(id, updateTenantDto);
    if (!updated) {
      throw new HttpException('Tenant not found', HttpStatus.NOT_FOUND);
    }
    return updated;
  }

  @ApiOperation({ summary: 'Archive a tenant (mark as inactive)' })
  @ApiResponse({
    status: 200,
    description: 'The tenant has been archived',
    type: Tenant,
  })
  @ApiResponse({
    status: 404,
    description: 'Tenant not found',
  })
  @ApiParam({
    name: 'id',
    description: 'Tenant ID',
    type: Number,
  })
  @Post(':id/archive')
  async archive(@Param('id') id: number): Promise<Tenant> {
    const archived = await this.tenantsService.archive(id);
    if (!archived) {
      throw new HttpException('Tenant not found', HttpStatus.NOT_FOUND);
    }
    return archived;
  }

  @ApiOperation({ summary: 'Update bill preferences for a tenant' })
  @ApiResponse({
    status: 200,
    description: "The tenant's bill preferences have been updated",
    type: Tenant,
  })
  @ApiResponse({
    status: 404,
    description: 'Tenant not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiParam({
    name: 'id',
    description: 'Tenant ID',
    type: Number,
  })
  @Patch(':id/bill-preferences')
  async updateBillPreferences(
    @Param('id', ParseIntPipe) id: number,
    @Body() billPreferencesDto: TenantBillPreferencesDto,
  ): Promise<Tenant> {
    const updated = await this.tenantsService.updateBillPreferences(
      id,
      billPreferencesDto,
    );
    if (!updated) {
      throw new HttpException('Tenant not found', HttpStatus.NOT_FOUND);
    }
    return updated;
  }

  @ApiOperation({ summary: 'Delete a tenant permanently' })
  @ApiResponse({
    status: 200,
    description: 'The tenant has been successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Tenant not found',
  })
  @ApiParam({
    name: 'id',
    description: 'Tenant ID',
    type: Number,
  })
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    const result = await this.tenantsService.remove(id);
    if (!result) {
      throw new HttpException('Tenant not found', HttpStatus.NOT_FOUND);
    }
  }

  @ApiOperation({
    summary: 'Preview tenant closure without actually closing the account',
    description:
      'Calculates what the final balance would be if tenant were to leave now. ' +
      "This is useful when a tenant gives notice they're leaving, so you can show them " +
      "what their final balance would be. This endpoint does NOT change the tenant's " +
      'active status or modify any records. It simply provides a preview calculation.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns closure preview calculation details',
    schema: {
      properties: {
        tenant_id: { type: 'number', example: 42 },
        tenant_name: { type: 'string', example: 'John Doe' },
        security_deposit: { type: 'number', example: 2000 },
        estimated_deductions: { type: 'number', example: 250.75 },
        deduction_reason: {
          type: 'string',
          example: 'Wall repairs and deep cleaning',
        },
        advance_payment: { type: 'number', example: 500 },
        outstanding_balance: { type: 'number', example: 1200.5 },
        final_balance_due: { type: 'number', example: 700.5 },
        potential_refund: { type: 'number', example: 1749.25 },
        preview_date: { type: 'string', format: 'date-time' },
        is_preview: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Error generating closure preview',
  })
  @ApiResponse({
    status: 404,
    description: 'Tenant not found',
  })
  @ApiParam({
    name: 'id',
    description: 'Tenant ID',
    type: Number,
  })
  @Post(':id/closure-preview')
  async previewClosure(
    @Param('id', ParseIntPipe) id: number,
    @Body() previewDto: ClosurePreviewDto,
  ): Promise<any> {
    try {
      return await this.tenantsService.previewClosure(id, previewDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Error generating closure preview',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiOperation({
    summary: 'Process tenant checkout/closure and handle security deposit',
    description:
      'Calculates final balance, refund amount, and processes security deposit. ' +
      'This endpoint performs the actual tenant closure, marking them as inactive and ' +
      'settling their account. It includes calculating outstanding balances, applying ' +
      'advance payments, and handling security deposit refunds or deductions. ' +
      'Following the running month billing model, tenants are responsible for the full ' +
      "month's bill regardless of their exact move-out date within the month.",
  })
  @ApiResponse({
    status: 200,
    description: 'Returns closure calculation details',
    schema: {
      properties: {
        tenant_id: { type: 'number', example: 42 },
        tenant_name: { type: 'string', example: 'John Doe' },
        security_deposit: { type: 'number', example: 2000 },
        deposit_deductions: { type: 'number', example: 250.75 },
        deduction_reason: {
          type: 'string',
          example: 'Wall repairs and deep cleaning',
        },
        advance_payment: { type: 'number', example: 500 },
        outstanding_balance: { type: 'number', example: 1200.5 },
        final_balance_due: { type: 'number', example: 700.5 },
        refund_amount: { type: 'number', example: 1749.25 },
        closure_date: { type: 'string', format: 'date-time' },
        is_preview: { type: 'boolean', example: false },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Error processing tenant closure',
  })
  @ApiResponse({
    status: 404,
    description: 'Tenant not found',
  })
  @ApiParam({
    name: 'id',
    description: 'Tenant ID',
    type: Number,
  })
  @Post(':id/closure')
  async processTenantClosure(
    @Param('id', ParseIntPipe) id: number,
    @Body() closureDto: TenantClosureDto,
  ): Promise<any> {
    try {
      return await this.tenantsService.processTenantClosure(id, closureDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Error processing tenant closure',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
