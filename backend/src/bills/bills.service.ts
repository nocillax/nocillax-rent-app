import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bill } from '../entities/bill.entity';
import { TenantsService } from '../tenants/tenants.service';

@Injectable()
export class BillsService {
  constructor(
    @InjectRepository(Bill)
    private billsRepository: Repository<Bill>,
    private tenantsService: TenantsService,
  ) {}

  async findAll(tenantId?: number, year?: number, month?: number): Promise<Bill[]> {
    const query: any = {
      relations: ['tenant'],
      order: { year: 'DESC', month: 'DESC' },
    };

    if (tenantId) {
      query.where = { tenant_id: tenantId };
    }

    if (year) {
      query.where = query.where || {};
      query.where.year = year;
    }

    if (month) {
      query.where = query.where || {};
      query.where.month = month;
    }

    return this.billsRepository.find(query);
  }

  async findOne(id: number): Promise<Bill | null> {
    return this.billsRepository.findOne({
      where: { id },
      relations: ['tenant'],
    });
  }

  async create(bill: Bill): Promise<Bill> {
    // Validate tenant exists
    if (bill.tenant_id) {
      const tenant = await this.tenantsService.findOne(bill.tenant_id);
      if (!tenant) {
        throw new Error('Tenant not found');
      }
    }
    
    // Calculate total
    bill.total = this.calculateTotal(bill);
    
    return this.billsRepository.save(bill);
  }

  async update(id: number, bill: Partial<Bill>): Promise<Bill | null> {
    const existingBill = await this.findOne(id);
    if (!existingBill) {
      return null;
    }

    // If tenant_id is changing, validate the new tenant exists
    if (bill.tenant_id && bill.tenant_id !== existingBill.tenant_id) {
      const tenant = await this.tenantsService.findOne(bill.tenant_id);
      if (!tenant) {
        throw new Error('Tenant not found');
      }
    }

    // Calculate total if any bill components are being updated
    if (this.isBillAmountUpdated(bill)) {
      const updatedBill = { ...existingBill, ...bill };
      bill.total = this.calculateTotal(updatedBill);
    }
    
    await this.billsRepository.update(id, bill);
    return this.findOne(id);
  }

  async markAsPaid(id: number): Promise<Bill | null> {
    await this.billsRepository.update(id, { is_paid: true });
    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.billsRepository.delete(id);
    return result.affected !== null && result.affected !== undefined && result.affected > 0;
  }

  private calculateTotal(bill: Bill): number {
    return (
      (bill.rent || 0) +
      (bill.water_bill || 0) +
      (bill.gas_bill || 0) +
      (bill.electricity_bill || 0) +
      (bill.internet_bill || 0) +
      (bill.service_charge || 0) +
      (bill.other_charges || 0)
    );
  }

  private isBillAmountUpdated(bill: Partial<Bill>): boolean {
    return (
      bill.rent !== undefined ||
      bill.water_bill !== undefined ||
      bill.gas_bill !== undefined ||
      bill.electricity_bill !== undefined ||
      bill.internet_bill !== undefined ||
      bill.service_charge !== undefined ||
      bill.other_charges !== undefined
    );
  }
}
