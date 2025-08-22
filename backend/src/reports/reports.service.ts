import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Bill } from '../entities/bill.entity';
import { Payment } from '../entities/payment.entity';
import { Tenant } from '../entities/tenant.entity';
import { ReportsGenerator } from './reports.generator';
import * as fs from 'fs-extra';
import * as path from 'path';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Bill)
    private billsRepository: Repository<Bill>,
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    @InjectRepository(Tenant)
    private tenantsRepository: Repository<Tenant>,
    private reportsGenerator: ReportsGenerator,
  ) {}

  async generateMonthlyPdfReport(year: number, month: number): Promise<Buffer> {
    // Get all bills for the specified month
    const bills = await this.billsRepository.find({
      where: {
        year,
        month,
      },
      relations: ['tenant'],
    });

    // Get all payments for the specified month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // Last day of month
    
    const payments = await this.paymentsRepository.find({
      where: {
        date: Between(startDate, endDate),
      },
      relations: ['tenant'],
    });

    // Generate PDF report
    return this.reportsGenerator.generateMonthlyPdfReport(bills, payments, year, month);
  }

  async generateTenantStatement(
    tenantId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<Buffer> {
    // Get tenant details
    const tenant = await this.tenantsRepository.findOne({
      where: { id: tenantId },
      relations: ['apartment'],
    });

    if (!tenant) {
      throw new Error('Tenant not found');
    }

    // Get bills for the tenant within the date range
    // Since bills are stored by month/year, we need to find bills that fall within our date range
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth() + 1; // JavaScript months are 0-indexed
    const endYear = endDate.getFullYear();
    const endMonth = endDate.getMonth() + 1;

    const bills = await this.billsRepository.find({
      where: [
        {
          tenant_id: tenantId,
          year: startYear,
          month: startMonth >= endMonth && startYear === endYear ? Between(startMonth, endMonth) : Between(startMonth, 12),
        },
        {
          tenant_id: tenantId,
          year: endYear,
          month: startYear !== endYear ? Between(1, endMonth) : Between(startMonth, endMonth),
        },
        ...(endYear - startYear > 1
          ? Array.from({ length: endYear - startYear - 1 }, (_, i) => ({
              tenant_id: tenantId,
              year: startYear + i + 1,
            }))
          : []),
      ],
    });

    // Get payments for the tenant within the date range
    const payments = await this.paymentsRepository.find({
      where: {
        tenant_id: tenantId,
        date: Between(startDate, endDate),
      },
    });

    // Generate PDF statement
    return this.reportsGenerator.generateTenantStatementPdf(
      tenant,
      bills,
      payments,
      startDate,
      endDate,
    );
  }

  async saveReportToFile(pdfBuffer: Buffer, filename: string): Promise<string> {
    // Create reports directory if it doesn't exist
    const reportsDir = path.join(process.cwd(), 'reports');
    await fs.ensureDir(reportsDir);
    
    // Save the file
    const filePath = path.join(reportsDir, filename);
    await fs.writeFile(filePath, pdfBuffer);
    
    return filePath;
  }
}
