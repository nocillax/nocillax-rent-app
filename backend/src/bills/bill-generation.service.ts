import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { Bill } from '../entities/bill.entity';
import { Tenant } from '../entities/tenant.entity';

@Injectable()
export class BillGenerationService {
  private readonly logger = new Logger(BillGenerationService.name);

  constructor(
    @InjectRepository(Bill)
    private readonly billsRepository: Repository<Bill>,
    @InjectRepository(Tenant)
    private readonly tenantsRepository: Repository<Tenant>,
  ) {}

  /**
   * Runs on the first day of each month at 00:01 AM
   * Generates bills for all active tenants
   */
  @Cron('1 0 1 * *') // Run at 00:01 on the 1st day of every month
  async generateMonthlyBills() {
    this.logger.log('Running monthly bill generation...');

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // JavaScript months are 0-indexed

    // Get all active tenants with their apartments
    const tenants = await this.tenantsRepository.find({
      where: { is_active: true },
      relations: ['apartment'],
    });

    this.logger.log(
      `Found ${tenants.length} active tenants to generate bills for`,
    );

    // Set due date as 10 days from now
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 10);

    for (const tenant of tenants) {
      await this.generateBillForTenant(tenant, year, month, dueDate);
    }

    this.logger.log('Monthly bill generation completed');
  }

  /**
   * Generate a bill for a specific tenant for a given month/year
   */
  async generateBillForTenant(
    tenant: Tenant,
    year: number,
    month: number,
    dueDate: Date,
  ) {
    try {
      // Check if a bill already exists for this tenant for this month/year
      const existingBill = await this.billsRepository.findOne({
        where: {
          tenant_id: tenant.id,
          year,
          month,
        },
      });

      if (existingBill) {
        this.logger.log(
          `Bill already exists for tenant ${tenant.id} for ${month}/${year}`,
        );
        return existingBill;
      }

      // Get the previous month's bill to check for unpaid balance
      const prevMonth = month === 1 ? 12 : month - 1;
      const prevYear = month === 1 ? year - 1 : year;

      const previousBill = await this.billsRepository.findOne({
        where: {
          tenant_id: tenant.id,
          year: prevYear,
          month: prevMonth,
        },
      });

      // Calculate previous balance
      let previousBalance = 0;
      if (previousBill && !previousBill.is_paid) {
        previousBalance = previousBill.total - previousBill.advance_payment;
        if (previousBalance < 0) previousBalance = 0;
      }

      // Calculate advance payment from previous bill
      let advancePayment = 0;
      if (previousBill && previousBill.advance_payment > previousBill.total) {
        advancePayment = previousBill.advance_payment - previousBill.total;
      }

      // Check tenant's advance payment balance
      if (tenant.advance_payment > 0) {
        advancePayment += tenant.advance_payment;

        // Reset tenant's advance payment since we're applying it to this bill
        await this.tenantsRepository.update(tenant.id, { advance_payment: 0 });
      }

      // Create new bill using apartment's base rent and tenant's bill preferences
      const newBill = this.billsRepository.create({
        tenant_id: tenant.id,
        apartment_id: tenant.apartment_id,
        year,
        month,
        rent: tenant.apartment.base_rent,
        water_bill: tenant.water_bill_enabled ? 0 : 0, // Default 0, to be filled manually
        gas_bill: tenant.gas_bill_enabled ? 0 : 0,
        electricity_bill: tenant.electricity_bill_enabled ? 0 : 0,
        internet_bill: tenant.internet_bill_enabled ? 0 : 0,
        service_charge: tenant.service_charge_enabled ? 0 : 0,
        trash_bill: tenant.trash_bill_enabled ? 0 : 0,
        other_charges: 0,
        previous_balance: previousBalance,
        advance_payment: advancePayment,
        due_date: dueDate,
        is_paid: false,
      });

      // Calculate total
      newBill.total = this.calculateTotal(newBill);

      // If advance payment covers the total, mark as paid
      if (newBill.advance_payment >= newBill.total) {
        newBill.is_paid = true;
        // Store remaining advance payment for next month
        const remainingAdvance = newBill.advance_payment - newBill.total;
        if (remainingAdvance > 0) {
          await this.tenantsRepository.update(tenant.id, {
            advance_payment: remainingAdvance,
          });
        }
      }

      const savedBill = await this.billsRepository.save(newBill);
      this.logger.log(
        `Generated bill #${savedBill.id} for tenant ${tenant.name} (${tenant.id}) for ${month}/${year}`,
      );

      return savedBill;
    } catch (error) {
      this.logger.error(
        `Error generating bill for tenant ${tenant.id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Calculate the total bill amount including previous balance and deducting advance payment
   */
  private calculateTotal(bill: Partial<Bill>): number {
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

  /**
   * Manually trigger bill generation for a specific month
   */
  async generateBillsForMonth(year: number, month: number): Promise<Bill[]> {
    this.logger.log(`Manually generating bills for ${month}/${year}`);

    // Get all active tenants with their apartments
    const tenants = await this.tenantsRepository.find({
      where: { is_active: true },
      relations: ['apartment'],
    });

    const dueDate = new Date(year, month - 1, 10); // Due on the 10th
    const generatedBills: Bill[] = [];

    for (const tenant of tenants) {
      const bill = await this.generateBillForTenant(
        tenant,
        year,
        month,
        dueDate,
      );
      generatedBills.push(bill);
    }

    return generatedBills;
  }
}
