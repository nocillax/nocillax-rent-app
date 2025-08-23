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
} from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { Tenant } from '../entities/tenant.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tenants')
@UseGuards(JwtAuthGuard)
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get()
  findAll(@Query('apartmentId') apartmentId?: number): Promise<Tenant[]> {
    return this.tenantsService.findAll(apartmentId);
  }

  @Get('archive')
  findArchived(): Promise<Tenant[]> {
    return this.tenantsService.findArchived();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Tenant> {
    const tenant = await this.tenantsService.findOne(id);
    if (!tenant) {
      throw new HttpException('Tenant not found', HttpStatus.NOT_FOUND);
    }
    return tenant;
  }
  
  @Get(':id/bills')
  async findBills(@Param('id') id: number): Promise<any[]> {
    const tenant = await this.tenantsService.findOne(id);
    if (!tenant) {
      throw new HttpException('Tenant not found', HttpStatus.NOT_FOUND);
    }
    return this.tenantsService.findBills(id);
  }
  
  @Get(':id/payments')
  async findPayments(@Param('id') id: number): Promise<any[]> {
    const tenant = await this.tenantsService.findOne(id);
    if (!tenant) {
      throw new HttpException('Tenant not found', HttpStatus.NOT_FOUND);
    }
    return this.tenantsService.findPayments(id);
  }

  @Post()
  create(@Body() tenant: Tenant): Promise<Tenant> {
    return this.tenantsService.create(tenant);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() tenant: Partial<Tenant>,
  ): Promise<Tenant> {
    const updated = await this.tenantsService.update(id, tenant);
    if (!updated) {
      throw new HttpException('Tenant not found', HttpStatus.NOT_FOUND);
    }
    return updated;
  }

  @Post(':id/archive')
  async archive(@Param('id') id: number): Promise<Tenant> {
    const archived = await this.tenantsService.archive(id);
    if (!archived) {
      throw new HttpException('Tenant not found', HttpStatus.NOT_FOUND);
    }
    return archived;
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    const result = await this.tenantsService.remove(id);
    if (!result) {
      throw new HttpException('Tenant not found', HttpStatus.NOT_FOUND);
    }
  }
}
