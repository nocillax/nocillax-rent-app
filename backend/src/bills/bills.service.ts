import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bill } from '../entities/bill.entity';
import { OtherCharge } from '../entities/other-charge.entity';
import { TenantsService } from '../tenants/tenants.service';
import { CreateBillDto } from '../dto/bill/create-bill.dto';
import { UpdateBillDto } from '../dto/bill/update-bill.dto';

@Injectable()
export class BillsService {
  private readonly logger = new Logger(BillsService.name);

  constructor(
    @InjectRepository(Bill)
    private billsRepository: Repository<Bill>,
    @InjectRepository(OtherCharge)
    private otherChargeRepository: Repository<OtherCharge>,
    private tenantsService: TenantsService,
  ) {}

  async findAll(
    tenantId?: number,
    year?: number,
    month?: number,
  ): Promise<Bill[]> {
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
      relations: ['tenant', 'other_charge_items'],
    });
  }

  async create(createBillDto: CreateBillDto): Promise<Bill> {
    // Validate tenant exists
    if (createBillDto.tenant_id) {
      const tenant = await this.tenantsService.findOne(createBillDto.tenant_id);
      if (!tenant) {
        throw new Error('Tenant not found');
      }
    }

    const bill = this.billsRepository.create(createBillDto);

    // Calculate total
    bill.total = this.calculateTotal(bill);

    return this.billsRepository.save(bill);
  }

  async update(id: number, updateBillDto: UpdateBillDto): Promise<Bill | null> {
    const existingBill = await this.findOne(id);
    if (!existingBill) {
      return null;
    }

    // If tenant_id is changing, validate the new tenant exists
    if (
      updateBillDto.tenant_id &&
      updateBillDto.tenant_id !== existingBill.tenant_id
    ) {
      const tenant = await this.tenantsService.findOne(updateBillDto.tenant_id);
      if (!tenant) {
        throw new Error('Tenant not found');
      }
    }

    // Calculate total if any bill components are being updated
    if (this.isBillAmountUpdated(updateBillDto)) {
      const updatedBill = { ...existingBill, ...updateBillDto };
      updateBillDto['total'] = this.calculateTotal(updatedBill);
    }

    await this.billsRepository.update(id, updateBillDto);
    return this.findOne(id);
  }

  async markAsPaid(id: number): Promise<Bill | null> {
    const bill = await this.findOne(id);
    if (!bill) {
      return null;
    }

    // Update the bill status
    await this.billsRepository.update(id, { is_paid: true });

    // Return the updated bill
    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.billsRepository.delete(id);
    return (
      result.affected !== null &&
      result.affected !== undefined &&
      result.affected > 0
    );
  }

  private calculateTotal(bill: Bill | CreateBillDto | any): number {
    const charges =
      (bill.rent || 0) +
      (bill.water_bill || 0) +
      (bill.gas_bill || 0) +
      (bill.electricity_bill || 0) +
      (bill.internet_bill || 0) +
      (bill.service_charge || 0) +
      (bill.trash_bill || 0) +
      (bill.other_charges || 0) +
      (bill.previous_balance || 0);

    // The total is the charges minus any advance payment
    return Math.max(0, charges - (bill.advance_payment || 0));
  }

  private isBillAmountUpdated(bill: Partial<Bill> | UpdateBillDto): boolean {
    return (
      bill.rent !== undefined ||
      bill.water_bill !== undefined ||
      bill.gas_bill !== undefined ||
      bill.electricity_bill !== undefined ||
      bill.internet_bill !== undefined ||
      bill.service_charge !== undefined ||
      bill.trash_bill !== undefined ||
      bill.other_charges !== undefined ||
      bill.previous_balance !== undefined ||
      bill.advance_payment !== undefined
    );
  }

  /**
   * Add a new ad-hoc charge to a bill
   */
  async addOtherCharge(
    billId: number,
    otherChargeData: { name: string; amount: number; description?: string },
  ): Promise<Bill> {
    const bill = await this.findOne(billId);
    if (!bill) {
      throw new Error('Bill not found');
    }

    // Create and save the other charge
    const otherCharge = this.otherChargeRepository.create({
      ...otherChargeData,
      bill_id: billId,
    });

    await this.otherChargeRepository.save(otherCharge);

    // Update the total other charges amount in the bill
    const allOtherCharges = await this.otherChargeRepository.find({
      where: { bill_id: billId },
    });

    const totalOtherCharges = allOtherCharges.reduce(
      (sum, charge) => sum + Number(charge.amount),
      0,
    );

    // Update the bill with the new total
    await this.billsRepository.update(billId, {
      other_charges: totalOtherCharges,
    });

    // Recalculate the total bill amount
    const updatedBill = await this.findOne(billId);
    const newTotal = this.calculateTotal(updatedBill);

    await this.billsRepository.update(billId, { total: newTotal });

    return this.findOne(billId);
  }

  /**
   * Remove an ad-hoc charge from a bill
   */
  async removeOtherCharge(billId: number, chargeId: number): Promise<boolean> {
    // First check if the charge exists and belongs to the bill
    const charge = await this.otherChargeRepository.findOne({
      where: {
        id: chargeId,
        bill_id: billId,
      },
    });

    if (!charge) {
      return false;
    }

    // Delete the charge
    const result = await this.otherChargeRepository.delete(chargeId);

    if (result.affected > 0) {
      // Update the total other charges amount in the bill
      const remainingCharges = await this.otherChargeRepository.find({
        where: { bill_id: billId },
      });

      const totalOtherCharges = remainingCharges.reduce(
        (sum, charge) => sum + Number(charge.amount),
        0,
      );

      // Update the bill with the new totals
      await this.billsRepository.update(billId, {
        other_charges: totalOtherCharges,
      });

      // Recalculate the total bill amount
      const bill = await this.findOne(billId);
      const newTotal = this.calculateTotal(bill);

      await this.billsRepository.update(billId, { total: newTotal });

      return true;
    }

    return false;
  }

  /**
   * Calculate the total bill amount including previous balance and deducting advance payment
   * This method is intentionally left empty to avoid duplicate method errors
   * The actual implementation is in the first calculateTotal method
   */
}
