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
  ParseIntPipe,
} from '@nestjs/common';
import { ApartmentsService } from './apartments.service';
import { Apartment } from '../entities/apartment.entity';
import { Bill } from '../entities/bill.entity';
import { Tenant } from '../entities/tenant.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateApartmentDto } from '../dto/apartment/create-apartment.dto';
import { UpdateApartmentDto } from '../dto/apartment/update-apartment.dto';

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
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Apartment> {
    const apartment = await this.apartmentsService.findOne(id);
    if (!apartment) {
      throw new HttpException('Apartment not found', HttpStatus.NOT_FOUND);
    }
    return apartment;
  }

  @Get(':id/bills')
  @UseGuards(JwtAuthGuard)
  async findBills(@Param('id', ParseIntPipe) id: number): Promise<Bill[]> {
    const apartment = await this.apartmentsService.findOne(id);
    if (!apartment) {
      throw new HttpException('Apartment not found', HttpStatus.NOT_FOUND);
    }
    return this.apartmentsService.findBillsForApartment(id);
  }

  @Get(':id/tenants')
  @UseGuards(JwtAuthGuard)
  async findTenants(@Param('id', ParseIntPipe) id: number): Promise<Tenant[]> {
    const apartment = await this.apartmentsService.findOne(id);
    if (!apartment) {
      throw new HttpException('Apartment not found', HttpStatus.NOT_FOUND);
    }
    return this.apartmentsService.findTenantsForApartment(id);
  }

  @Post()
  create(@Body() createApartmentDto: CreateApartmentDto): Promise<Apartment> {
    return this.apartmentsService.create(createApartmentDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateApartmentDto: UpdateApartmentDto,
  ): Promise<Apartment> {
    const updated = await this.apartmentsService.update(id, updateApartmentDto);
    if (!updated) {
      throw new HttpException('Apartment not found', HttpStatus.NOT_FOUND);
    }
    return updated;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const result = await this.apartmentsService.remove(id);
    if (!result) {
      throw new HttpException('Apartment not found', HttpStatus.NOT_FOUND);
    }
  }
}
