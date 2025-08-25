import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Payment } from '../entities/payment.entity';
import { TenantsService } from '../tenants/tenants.service';
import { CreatePaymentDto } from '../dto/payment/create-payment.dto';
import { UpdatePaymentDto } from '../dto/payment/update-payment.dto';

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

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    // Validate tenant exists
    let tenant;
    if (createPaymentDto.tenant_id) {
      tenant = await this.tenantsService.findOne(createPaymentDto.tenant_id);
      if (!tenant) {
        throw new Error('Tenant not found');
      }
    }

    // Create the payment with DTO data
    const payment = this.paymentsRepository.create(createPaymentDto);

    // Set the date if provided, otherwise it will use current date
    if (createPaymentDto.date) {
      payment.date = new Date(createPaymentDto.date);
    }

    // Calculate and set the remaining balance
    const remainingBalance = await this.calculateRemainingBalance(
      tenant,
      payment.amount,
    );
    payment.remaining_balance = remainingBalance;

    // Save the payment
    const savedPayment = await this.paymentsRepository.save(payment);

    // Check for advance payment by calculating the tenant's total bills vs. total payments
    await this.processAdvancePayment(tenant);

    return savedPayment;
  }

  /**
   * Process advance payment calculation for a tenant
   * This calculates if the tenant has paid more than their bills total
   * and stores the excess as advance payment
   */
  private async processAdvancePayment(tenant: any): Promise<void> {
    if (!tenant) return;

    // Get all bills for this tenant
    const bills = tenant.bills || [];
    const totalBillAmount = bills.reduce(
      (sum, bill) => sum + Number(bill.total),
      0,
    );

    // Get total payments
    const totalPayments = await this.getTotalPaymentsByTenantId(tenant.id);

    // Calculate advance (overpaid amount)
    const advanceAmount = Math.max(0, totalPayments - totalBillAmount);

    if (advanceAmount > 0) {
      // Update tenant with advance payment
      await this.tenantsService.update(tenant.id, {
        advance_payment: advanceAmount,
      });
    }
  }

  async update(
    id: number,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment | null> {
    // If tenant_id is changing, validate the new tenant exists
    if (updatePaymentDto.tenant_id) {
      const tenant = await this.tenantsService.findOne(
        updatePaymentDto.tenant_id,
      );
      if (!tenant) {
        throw new Error('Tenant not found');
      }
    }

    // Get existing payment to update
    const existingPayment = await this.findOne(id);
    if (!existingPayment) {
      return null;
    }

    // Create update data object starting with the DTO fields
    const updateData: any = { ...updatePaymentDto };

    // Special handling for date - convert string to Date object
    if (updatePaymentDto.date) {
      // Use 'any' type for updateData to bypass TypeScript's type checking
      // This is necessary because the entity expects a Date but the DTO has a string
      updateData.date = new Date(updatePaymentDto.date);
    }

    await this.paymentsRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.paymentsRepository.delete(id);
    return (
      result.affected !== null &&
      result.affected !== undefined &&
      result.affected > 0
    );
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

  /**
   * Get payment history with remaining balance for a tenant
   * Shows a history of all payments and the remaining balance after each payment
   */
  async getTenantPaymentHistory(tenantId: number): Promise<any[]> {
    // Get all payments for the tenant ordered by date
    const payments = await this.paymentsRepository.find({
      where: { tenant_id: tenantId },
      order: { date: 'ASC' },
    });

    // Format the payments with balance info
    return payments.map((payment) => ({
      payment_id: payment.id,
      date: payment.date,
      amount: payment.amount,
      remaining_balance: payment.remaining_balance || 0,
      payment_method: payment.payment_method,
      reference_number: payment.reference_number,
    }));
  }

  /**
   * Calculate the remaining balance after a payment is made
   * This calculates the total outstanding amount minus the payment amount
   */
  private async calculateRemainingBalance(
    tenant: any,
    paymentAmount: number,
  ): Promise<number> {
    if (!tenant) return 0;

    // Get all bills for this tenant
    const bills = tenant.bills || [];

    // Calculate total outstanding amount from unpaid bills
    const totalOutstanding = bills
      .filter((bill) => !bill.is_paid)
      .reduce((sum, bill) => sum + Number(bill.total), 0);

    // Calculate remaining balance after this payment
    const remainingBalance = Math.max(0, totalOutstanding - paymentAmount);

    return remainingBalance;
  }
}
