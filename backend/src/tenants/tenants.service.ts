import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../entities/tenant.entity';
import { ApartmentsService } from '../apartments/apartments.service';
import { CreateTenantDto } from '../dto/tenant/create-tenant.dto';
import { UpdateTenantDto } from '../dto/tenant/update-tenant.dto';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private tenantsRepository: Repository<Tenant>,
    private apartmentsService: ApartmentsService,
  ) {}

  async findAll(apartmentId?: number): Promise<Tenant[]> {
    const options: any = {
      relations: ['apartment'],
      order: { name: 'ASC' },
      where: { is_active: true },
    };

    if (apartmentId) {
      options.where.apartment_id = apartmentId;
    }

    return this.tenantsRepository.find(options);
  }

  async findArchived(): Promise<Tenant[]> {
    return this.tenantsRepository.find({
      relations: ['apartment'],
      where: { is_active: false },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Tenant | null> {
    return this.tenantsRepository.findOne({
      where: { id },
      relations: ['apartment', 'bills', 'payments'],
    });
  }

  async findBills(id: number): Promise<any[]> {
    const tenant = await this.tenantsRepository.findOne({
      where: { id },
      relations: ['bills'],
    });

    if (!tenant) {
      return [];
    }

    return tenant.bills;
  }

  async findPayments(id: number): Promise<any[]> {
    const tenant = await this.tenantsRepository.findOne({
      where: { id },
      relations: ['payments'],
    });

    if (!tenant) {
      return [];
    }

    return tenant.payments;
  }

  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    // Validate that the apartment exists
    if (createTenantDto.apartment_id) {
      const apartment = await this.apartmentsService.findOne(
        createTenantDto.apartment_id,
      );
      if (!apartment) {
        throw new Error('Apartment not found');
      }
    }

    const tenant = this.tenantsRepository.create(createTenantDto);
    return this.tenantsRepository.save(tenant);
  }

  async update(
    id: number,
    updateTenantDto: UpdateTenantDto,
  ): Promise<Tenant | null> {
    // Validate that the apartment exists if it's being updated
    if (updateTenantDto.apartment_id) {
      const apartment = await this.apartmentsService.findOne(
        updateTenantDto.apartment_id,
      );
      if (!apartment) {
        throw new Error('Apartment not found');
      }
    }

    await this.tenantsRepository.update(id, updateTenantDto);
    return this.findOne(id);
  }

  async archive(id: number): Promise<Tenant | null> {
    await this.tenantsRepository.update(id, { is_active: false });
    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.tenantsRepository.delete(id);
    return (
      result.affected !== null &&
      result.affected !== undefined &&
      result.affected > 0
    );
  }
}
