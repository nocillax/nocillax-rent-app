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

  /**
   * Calculate final bill for a tenant that is planning to leave
   * This will generate a full bill for the current month if needed,
   * and calculate the final balance after security deposit deduction
   *
   * Following the "running month" billing model:
   * - Bills are calculated for the full month regardless of the actual move-out date
   * - No proration is applied for partial month occupancy
   * - If no current month bill exists, a full bill is estimated based on previous months
   * - Advance payments are applied first, then security deposit is used
   */
  async calculateFinalBillForTenant(tenantId: number): Promise<any> {
    // Get the tenant
    const tenant = await this.tenantsService.findOne(tenantId);
    if (!tenant) {
      throw new Error('Tenant not found');
    }

    // Get current date information
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // JS months are 0-indexed
    const currentYear = currentDate.getFullYear();

    // Check if there's already a bill for the current month
    const currentMonthBills = await this.findAll(
      tenantId,
      currentYear,
      currentMonth,
    );

    // Variable to hold the current month's bill (existing or newly created)
    let currentMonthBill;
    let billSource = '';

    // If there's no bill for the current month, we'll create a full one (no proration)
    if (currentMonthBills.length === 0) {
      // Find the most recent bill to use as a template
      const recentBills = await this.billsRepository.find({
        where: { tenant_id: tenantId },
        order: { year: 'DESC', month: 'DESC' },
        take: 1,
      });

      // If there are no previous bills, we can't make a good estimate
      if (recentBills.length === 0) {
        return {
          has_current_bill: false,
          estimated_bill: null,
          message:
            'No billing history available to create a bill for the current month',
          security_deposit: tenant.security_deposit || 0,
        };
      }

      // Use the most recent bill as a template
      const templateBill = recentBills[0];

      // Create a full (not prorated) bill based on the template
      currentMonthBill = {
        month: currentMonth,
        year: currentYear,
        rent: templateBill.rent,
        water_bill: tenant.water_bill_enabled ? templateBill.water_bill : 0,
        gas_bill: tenant.gas_bill_enabled ? templateBill.gas_bill : 0,
        electricity_bill: tenant.electricity_bill_enabled
          ? templateBill.electricity_bill
          : 0,
        internet_bill: tenant.internet_bill_enabled
          ? templateBill.internet_bill
          : 0,
        service_charge: tenant.service_charge_enabled
          ? templateBill.service_charge
          : 0,
        trash_bill: tenant.trash_bill_enabled ? templateBill.trash_bill : 0,
        other_charges: 0, // Don't include one-time charges in the estimate
      };

      // Calculate total of the full bill (no proration)
      currentMonthBill['total'] =
        currentMonthBill.rent +
        currentMonthBill.water_bill +
        currentMonthBill.gas_bill +
        currentMonthBill.electricity_bill +
        currentMonthBill.internet_bill +
        currentMonthBill.service_charge +
        currentMonthBill.trash_bill;

      billSource = 'estimated';
    } else {
      // Use the existing bill for the current month
      currentMonthBill = currentMonthBills[0];
      billSource = 'existing';
    }

    // Get all unpaid bills for this tenant (including current month)
    const unpaidBills = await this.billsRepository.find({
      where: { tenant_id: tenantId, is_paid: false },
      order: { year: 'DESC', month: 'DESC' },
    });

    // Calculate total outstanding amount from all unpaid bills
    const totalOutstanding = unpaidBills.reduce(
      (sum, bill) => sum + Number(bill.total),
      0,
    );

    // Calculate the security deposit available
    const securityDeposit = tenant.security_deposit || 0;

    // Calculate advance payment available
    const advancePayment = tenant.advance_payment || 0;

    // First apply advance payment to outstanding balance
    const remainingAfterAdvance = Math.max(
      0,
      totalOutstanding - advancePayment,
    );

    // Then calculate amount due after applying security deposit
    const finalAmountDue = Math.max(0, remainingAfterAdvance - securityDeposit);

    // If security deposit exceeds remaining balance, calculate refund
    const securityDepositRefund =
      securityDeposit > remainingAfterAdvance
        ? securityDeposit - remainingAfterAdvance
        : 0;

    return {
      current_month_bill: currentMonthBill,
      bill_source: billSource,
      all_unpaid_bills: unpaidBills,
      total_outstanding: totalOutstanding,
      advance_payment: advancePayment,
      security_deposit: securityDeposit,
      remaining_after_advance: remainingAfterAdvance,
      security_deposit_refund: securityDepositRefund,
      final_amount_due: finalAmountDue,
      calculation_date: new Date(),
      message:
        billSource === 'existing'
          ? 'Using existing bill for current month in final calculation'
          : 'Created full month bill for current month in final calculation',
    };
  }
}
