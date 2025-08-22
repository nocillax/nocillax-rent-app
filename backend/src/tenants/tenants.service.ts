import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../entities/tenant.entity';
import { ApartmentsService } from '../apartments/apartments.service';

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

  async create(tenant: Tenant): Promise<Tenant> {
    // Validate that the apartment exists
    if (tenant.apartment_id) {
      const apartment = await this.apartmentsService.findOne(tenant.apartment_id);
      if (!apartment) {
        throw new Error('Apartment not found');
      }
    }
    
    return this.tenantsRepository.save(tenant);
  }

  async update(id: number, tenant: Partial<Tenant>): Promise<Tenant | null> {
    // Validate that the apartment exists if it's being updated
    if (tenant.apartment_id) {
      const apartment = await this.apartmentsService.findOne(tenant.apartment_id);
      if (!apartment) {
        throw new Error('Apartment not found');
      }
    }
    
    await this.tenantsRepository.update(id, tenant);
    return this.findOne(id);
  }

  async archive(id: number): Promise<Tenant | null> {
    await this.tenantsRepository.update(id, { is_active: false });
    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.tenantsRepository.delete(id);
    return result.affected !== null && result.affected !== undefined && result.affected > 0;
  }
}
