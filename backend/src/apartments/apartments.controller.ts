import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpStatus,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { ApartmentsService } from './apartments.service';
import { Apartment } from '../entities/apartment.entity';
import { Bill } from '../entities/bill.entity';
import { Tenant } from '../entities/tenant.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('apartments')
export class ApartmentsController {
  constructor(private readonly apartmentsService: ApartmentsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(): Promise<Apartment[]> {
    return this.apartmentsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: number): Promise<Apartment> {
    const apartment = await this.apartmentsService.findOne(id);
    if (!apartment) {
      throw new HttpException('Apartment not found', HttpStatus.NOT_FOUND);
    }
    return apartment;
  }
  
  @Get(':id/bills')
  @UseGuards(JwtAuthGuard)
  async findBills(@Param('id') id: number): Promise<Bill[]> {
    const apartment = await this.apartmentsService.findOne(id);
    if (!apartment) {
      throw new HttpException('Apartment not found', HttpStatus.NOT_FOUND);
    }
    return this.apartmentsService.findBillsForApartment(id);
  }
  
  @Get(':id/tenants')
  @UseGuards(JwtAuthGuard)
  async findTenants(@Param('id') id: number): Promise<Tenant[]> {
    const apartment = await this.apartmentsService.findOne(id);
    if (!apartment) {
      throw new HttpException('Apartment not found', HttpStatus.NOT_FOUND);
    }
    return this.apartmentsService.findTenantsForApartment(id);
  }

  @Post()
  create(@Body() apartment: Apartment): Promise<Apartment> {
    return this.apartmentsService.create(apartment);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() apartment: Apartment,
  ): Promise<Apartment> {
    const updated = await this.apartmentsService.update(id, apartment);
    if (!updated) {
      throw new HttpException('Apartment not found', HttpStatus.NOT_FOUND);
    }
    return updated;
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    const result = await this.apartmentsService.remove(id);
    if (!result) {
      throw new HttpException('Apartment not found', HttpStatus.NOT_FOUND);
    }
  }
}
