import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Patch,
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
import { UpdateApartmentBillingDto } from '../dto/apartment/update-apartment-billing.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('apartments')
@ApiBearerAuth()
@Controller('apartments')
export class ApartmentsController {
  constructor(private readonly apartmentsService: ApartmentsService) {}

  @ApiOperation({
    summary: 'Get all apartments',
    description: 'Retrieves a list of all apartments in the system',
  })
  @ApiResponse({
    status: 200,
    description: 'List of apartments retrieved successfully',
    type: [Apartment],
  })
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(): Promise<Apartment[]> {
    return this.apartmentsService.findAll();
  }

  @ApiOperation({
    summary: 'Get apartment by ID',
    description: 'Retrieves a specific apartment by its ID',
  })
  @ApiParam({ name: 'id', description: 'Apartment ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Apartment retrieved successfully',
    type: Apartment,
  })
  @ApiResponse({ status: 404, description: 'Apartment not found' })
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Apartment> {
    const apartment = await this.apartmentsService.findOne(id);
    if (!apartment) {
      throw new HttpException('Apartment not found', HttpStatus.NOT_FOUND);
    }
    return apartment;
  }

  @ApiOperation({
    summary: 'Get bills for an apartment',
    description: 'Retrieves all bills associated with a specific apartment',
  })
  @ApiParam({ name: 'id', description: 'Apartment ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Bills retrieved successfully',
    type: [Bill],
  })
  @ApiResponse({ status: 404, description: 'Apartment not found' })
  @Get(':id/bills')
  @UseGuards(JwtAuthGuard)
  async findBills(@Param('id', ParseIntPipe) id: number): Promise<Bill[]> {
    const apartment = await this.apartmentsService.findOne(id);
    if (!apartment) {
      throw new HttpException('Apartment not found', HttpStatus.NOT_FOUND);
    }
    return this.apartmentsService.findBillsForApartment(id);
  }

  @ApiOperation({
    summary: 'Get tenants for an apartment',
    description: 'Retrieves all tenants living in a specific apartment',
  })
  @ApiParam({ name: 'id', description: 'Apartment ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Tenants retrieved successfully',
    type: [Tenant],
  })
  @ApiResponse({ status: 404, description: 'Apartment not found' })
  @Get(':id/tenants')
  @UseGuards(JwtAuthGuard)
  async findTenants(@Param('id', ParseIntPipe) id: number): Promise<Tenant[]> {
    const apartment = await this.apartmentsService.findOne(id);
    if (!apartment) {
      throw new HttpException('Apartment not found', HttpStatus.NOT_FOUND);
    }
    return this.apartmentsService.findTenantsForApartment(id);
  }

  @ApiOperation({
    summary: 'Create a new apartment',
    description: 'Creates a new apartment with the provided information',
  })
  @ApiBody({ type: CreateApartmentDto, description: 'Apartment data' })
  @ApiResponse({
    status: 201,
    description: 'Apartment created successfully',
    type: Apartment,
  })
  @Post()
  create(@Body() createApartmentDto: CreateApartmentDto): Promise<Apartment> {
    return this.apartmentsService.create(createApartmentDto);
  }

  @ApiOperation({
    summary: 'Update an apartment',
    description: 'Updates an existing apartment with the provided information',
  })
  @ApiParam({ name: 'id', description: 'Apartment ID', type: Number })
  @ApiBody({ type: UpdateApartmentDto, description: 'Updated apartment data' })
  @ApiResponse({
    status: 200,
    description: 'Apartment updated successfully',
    type: Apartment,
  })
  @ApiResponse({ status: 404, description: 'Apartment not found' })
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

  @ApiOperation({
    summary: 'Delete an apartment',
    description: 'Removes an apartment from the system',
  })
  @ApiParam({ name: 'id', description: 'Apartment ID', type: Number })
  @ApiResponse({ status: 200, description: 'Apartment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Apartment not found' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.apartmentsService.remove(+id);
    if (!result) {
      throw new HttpException('Apartment not found', HttpStatus.NOT_FOUND);
    }
    return { success: true, message: 'Apartment deleted successfully' };
  }

  @Patch(':id/billing-structure')
  @ApiOperation({ summary: "Update an apartment's standard billing structure" })
  updateBillingStructure(
    @Param('id') id: string,
    @Body() updateBillingDto: UpdateApartmentBillingDto,
  ) {
    return this.apartmentsService.updateBillingStructure(+id, updateBillingDto);
  }
}
