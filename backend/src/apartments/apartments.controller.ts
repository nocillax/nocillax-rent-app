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
} from '@nestjs/common';
import { ApartmentsService } from './apartments.service';
import { Apartment } from '../entities/apartment.entity';

@Controller('apartments')
export class ApartmentsController {
  constructor(private readonly apartmentsService: ApartmentsService) {}

  @Get()
  findAll(): Promise<Apartment[]> {
    return this.apartmentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Apartment> {
    const apartment = await this.apartmentsService.findOne(id);
    if (!apartment) {
      throw new HttpException('Apartment not found', HttpStatus.NOT_FOUND);
    }
    return apartment;
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
