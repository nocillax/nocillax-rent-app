import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Apartment } from '../entities/apartment.entity';

@Injectable()
export class ApartmentsService {
  constructor(
    @InjectRepository(Apartment)
    private apartmentsRepository: Repository<Apartment>,
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
