import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateApartmentBillingDto } from '../dto/apartment/update-apartment-billing.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Apartment } from '../entities/apartment.entity';
import { Bill } from '../entities/bill.entity';
import { Tenant } from '../entities/tenant.entity';
import { CreateApartmentDto } from '../dto/apartment/create-apartment.dto';
import { UpdateApartmentDto } from '../dto/apartment/update-apartment.dto';

@Injectable()
export class ApartmentsService {
  constructor(
    @InjectRepository(Apartment)
    private apartmentsRepository: Repository<Apartment>,
    @InjectRepository(Bill)
    private billsRepository: Repository<Bill>,
    @InjectRepository(Tenant)
    private tenantsRepository: Repository<Tenant>,
  ) {}

  findAll(): Promise<Apartment[]> {
    return this.apartmentsRepository.find({
      relations: ['tenants'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Apartment | null> {
    return this.apartmentsRepository.findOne({
      where: { id },
      relations: ['tenants'],
    });
  }

  async findBillsForApartment(id: number): Promise<Bill[]> {
    return this.billsRepository.find({
      where: { apartment_id: id },
      relations: ['tenant'],
      order: { year: 'DESC', month: 'DESC' },
    });
  }

  async findTenantsForApartment(id: number): Promise<Tenant[]> {
    return this.tenantsRepository.find({
      where: { apartment_id: id, is_active: true },
      order: { name: 'ASC' },
    });
  }

  async create(createApartmentDto: CreateApartmentDto): Promise<Apartment> {
    const apartment = this.apartmentsRepository.create(createApartmentDto);
    return this.apartmentsRepository.save(apartment);
  }

  async update(
    id: number,
    updateApartmentDto: UpdateApartmentDto,
  ): Promise<Apartment | null> {
    await this.apartmentsRepository.update(id, updateApartmentDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.apartmentsRepository.delete(id);
    return (
      result.affected !== null &&
      result.affected !== undefined &&
      result.affected > 0
    );
  }

  async updateBillingStructure(
    id: number,
    updateBillingDto: UpdateApartmentBillingDto,
  ) {
    // Find the apartment
    const apartment = await this.apartmentsRepository.findOne({
      where: { id },
    });

    if (!apartment) {
      throw new NotFoundException(`Apartment with ID ${id} not found`);
    }

    // Update standard utility costs
    if (updateBillingDto.standardWaterBill !== undefined) {
      apartment.standard_water_bill = updateBillingDto.standardWaterBill;
    }

    if (updateBillingDto.standardElectricityBill !== undefined) {
      apartment.standard_electricity_bill =
        updateBillingDto.standardElectricityBill;
    }

    if (updateBillingDto.standardGasBill !== undefined) {
      apartment.standard_gas_bill = updateBillingDto.standardGasBill;
    }

    if (updateBillingDto.standardInternetBill !== undefined) {
      apartment.standard_internet_bill = updateBillingDto.standardInternetBill;
    }

    if (updateBillingDto.standardServiceCharge !== undefined) {
      apartment.standard_service_charge =
        updateBillingDto.standardServiceCharge;
    }

    if (updateBillingDto.standardTrashBill !== undefined) {
      apartment.standard_trash_bill = updateBillingDto.standardTrashBill;
    }

    // Calculate and update estimated_total_rent
    apartment.estimated_total_rent =
      apartment.base_rent +
      apartment.standard_water_bill +
      apartment.standard_electricity_bill +
      apartment.standard_gas_bill +
      apartment.standard_internet_bill +
      apartment.standard_service_charge +
      apartment.standard_trash_bill;

    // Save the updated apartment
    return this.apartmentsRepository.save(apartment);
  }
}
