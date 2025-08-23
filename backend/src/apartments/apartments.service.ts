import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Apartment } from '../entities/apartment.entity';
import { Bill } from '../entities/bill.entity';
import { Tenant } from '../entities/tenant.entity';

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

  async create(apartment: Apartment): Promise<Apartment> {
    return this.apartmentsRepository.save(apartment);
  }

  async update(id: number, apartment: Apartment): Promise<Apartment | null> {
    await this.apartmentsRepository.update(id, apartment);
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
}
