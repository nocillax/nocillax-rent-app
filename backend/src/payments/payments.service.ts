import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Payment } from '../entities/payment.entity';
import { TenantsService } from '../tenants/tenants.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    private tenantsService: TenantsService,
  ) {}

  async findAll(
    tenantId?: number,
    startDate?: Date,
    endDate?: Date,
  ): Promise<Payment[]> {
    const query: any = {
      relations: ['tenant'],
      order: { date: 'DESC' },
    };

    if (tenantId) {
      query.where = { tenant_id: tenantId };
    }

    if (startDate && endDate) {
      query.where = query.where || {};
      query.where.date = Between(startDate, endDate);
    } else if (startDate) {
      query.where = query.where || {};
      query.where.date = Between(startDate, new Date());
    }

    return this.paymentsRepository.find(query);
  }

  async findOne(id: number): Promise<Payment | null> {
    return this.paymentsRepository.findOne({
      where: { id },
      relations: ['tenant'],
    });
  }

  async create(payment: Payment): Promise<Payment> {
    // Validate tenant exists
    if (payment.tenant_id) {
      const tenant = await this.tenantsService.findOne(payment.tenant_id);
      if (!tenant) {
        throw new Error('Tenant not found');
      }
    }
    
    return this.paymentsRepository.save(payment);
  }

  async update(id: number, payment: Partial<Payment>): Promise<Payment | null> {
    // If tenant_id is changing, validate the new tenant exists
    if (payment.tenant_id) {
      const tenant = await this.tenantsService.findOne(payment.tenant_id);
      if (!tenant) {
        throw new Error('Tenant not found');
      }
    }
    
    await this.paymentsRepository.update(id, payment);
    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.paymentsRepository.delete(id);
    return result.affected !== null && result.affected !== undefined && result.affected > 0;
  }

  async getTotalPaymentsByTenantId(tenantId: number): Promise<number> {
    const result = await this.paymentsRepository
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'total')
      .where('payment.tenant_id = :tenantId', { tenantId })
      .getRawOne();
    
    return result.total ? parseFloat(result.total) : 0;
  }

  async getMonthlyPaymentSummary(year: number, month: number): Promise<any[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const result = await this.paymentsRepository
      .createQueryBuilder('payment')
      .select('payment.tenant_id', 'tenantId')
      .addSelect('SUM(payment.amount)', 'totalAmount')
      .leftJoinAndSelect('payment.tenant', 'tenant')
      .where('payment.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .groupBy('payment.tenant_id')
      .addGroupBy('tenant.name')
      .getRawMany();

    return result;
  }
}
