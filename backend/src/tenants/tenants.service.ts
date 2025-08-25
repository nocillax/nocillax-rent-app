import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../entities/tenant.entity';
import { ApartmentsService } from '../apartments/apartments.service';
import { CreateTenantDto } from '../dto/tenant/create-tenant.dto';
import { UpdateTenantDto } from '../dto/tenant/update-tenant.dto';
import { TenantBillPreferencesDto } from '../dto/tenant/bill-preferences.dto';
import { TenantClosureDto } from '../dto/tenant/tenant-closure.dto';
import { ClosurePreviewDto } from '../dto/tenant/closure-preview.dto';

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

  async updateBillPreferences(
    id: number,
    billPreferencesDto: TenantBillPreferencesDto,
  ): Promise<Tenant | null> {
    const tenant = await this.findOne(id);
    if (!tenant) {
      return null;
    }

    await this.tenantsRepository.update(id, billPreferencesDto);
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

  /**
   * Generate a closure preview/calculation without actually closing the tenant account
   * This shows what the final balance would be if the tenant were to leave now
   *
   * Following the "running month" billing model:
   * - Tenants pay for the full month regardless of their move-out date
   * - When a tenant leaves, the current month's bill is calculated in full
   * - No proration applies for partial month occupancy
   */
  async previewClosure(
    id: number,
    previewData: ClosurePreviewDto,
  ): Promise<any> {
    // Get tenant with all bills and payments
    const tenant = await this.findOne(id);
    if (!tenant) {
      throw new Error('Tenant not found');
    }

    // Calculate total bills
    const totalBillAmount = tenant.bills
      ? tenant.bills.reduce((sum, bill) => sum + Number(bill.total), 0)
      : 0;

    // Calculate total payments
    const totalPayments = tenant.payments
      ? tenant.payments.reduce(
          (sum, payment) => sum + Number(payment.amount),
          0,
        )
      : 0;

    // Calculate outstanding balance
    const outstandingBalance = Math.max(0, totalBillAmount - totalPayments);

    // Apply security deposit deductions (if any)
    const depositDeductions = previewData.estimated_deductions || 0;
    const securityDeposit = tenant.security_deposit || 0;
    const advancePayment = tenant.advance_payment || 0;

    // Calculate amount to refund to tenant
    // First, use advance payment to cover outstanding balance
    const remainingAdvance = Math.max(0, advancePayment - outstandingBalance);

    // Then calculate remaining security deposit after deductions
    const remainingDeposit = Math.max(0, securityDeposit - depositDeductions);

    // Total refund is remaining advance + remaining deposit
    const totalRefundAmount = remainingAdvance + remainingDeposit;

    // Final balance due from tenant (if any) after using advance payment
    const finalBalanceDue = Math.max(0, outstandingBalance - advancePayment);

    // Return the closure preview
    return {
      tenant_id: id,
      tenant_name: tenant.name,
      security_deposit: securityDeposit,
      estimated_deductions: depositDeductions,
      deduction_reason: previewData.deduction_reason || '',
      advance_payment: advancePayment,
      outstanding_balance: outstandingBalance,
      final_balance_due: finalBalanceDue,
      potential_refund: totalRefundAmount,
      preview_date: new Date(),
      is_preview: true, // Flag to indicate this is just a preview
    };
  }

  /**
   * Handle tenant checkout/closure and return deposit calculations
   * This handles the final settlement when a tenant is leaving
   *
   * Following the "running month" billing model:
   * - Tenants pay for the full month regardless of their actual move-out date
   * - No proration is applied for partial month occupancy
   * - The final bill calculation includes all unpaid bills
   * - Security deposit is applied after advance payments are used
   */
  async processTenantClosure(
    id: number,
    closureData: TenantClosureDto,
  ): Promise<any> {
    // Get tenant with all bills and payments
    const tenant = await this.findOne(id);
    if (!tenant) {
      throw new Error('Tenant not found');
    }

    // Calculate total bills
    const totalBillAmount = tenant.bills
      ? tenant.bills.reduce((sum, bill) => sum + Number(bill.total), 0)
      : 0;

    // Calculate total payments
    const totalPayments = tenant.payments
      ? tenant.payments.reduce(
          (sum, payment) => sum + Number(payment.amount),
          0,
        )
      : 0;

    // Calculate outstanding balance
    const outstandingBalance = Math.max(0, totalBillAmount - totalPayments);

    // Apply security deposit deductions (if any)
    const depositDeductions = closureData.deposit_deductions || 0;
    const securityDeposit = tenant.security_deposit || 0;
    const advancePayment = tenant.advance_payment || 0;

    // Calculate amount to refund to tenant
    // First, use advance payment to cover outstanding balance
    const remainingAdvance = Math.max(0, advancePayment - outstandingBalance);

    // Then calculate remaining security deposit after deductions
    const remainingDeposit = Math.max(0, securityDeposit - depositDeductions);

    // Total refund is remaining advance + remaining deposit
    const totalRefundAmount = remainingAdvance + remainingDeposit;

    // Final balance due from tenant (if any) after using advance payment
    const finalBalanceDue = Math.max(0, outstandingBalance - advancePayment);

    // Archive the tenant by setting is_active to false
    await this.tenantsRepository.update(id, {
      is_active: false,
      // Reset these values since they're accounted for in the closure
      advance_payment: 0,
      security_deposit: 0,
    });

    // Return the closure summary
    return {
      tenant_id: id,
      tenant_name: tenant.name,
      security_deposit: securityDeposit,
      deposit_deductions: depositDeductions,
      deduction_reason: closureData.deduction_reason || '',
      advance_payment: advancePayment,
      outstanding_balance: outstandingBalance,
      final_balance_due: finalBalanceDue,
      refund_amount: totalRefundAmount,
      closure_date: new Date(),
      is_preview: false, // Flag to indicate this is the actual closure
    };
  }
}
