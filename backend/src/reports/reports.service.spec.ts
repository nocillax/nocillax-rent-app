import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { ReportsGenerator } from './reports.generator';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Bill } from '../entities/bill.entity';
import { Payment } from '../entities/payment.entity';
import { Tenant } from '../entities/tenant.entity';
import { Repository, Between } from 'typeorm';
import * as fs from 'fs-extra';
import * as path from 'path';

// Mock fs-extra module
jest.mock('fs-extra', () => ({
  ensureDir: jest.fn(),
  writeFile: jest.fn(),
}));

// Mock path module
jest.mock('path', () => ({
  join: jest.fn((dir, file) => `${dir}/${file}`),
}));

describe('ReportsService', () => {
  let service: ReportsService;
  let billsRepository: Repository<Bill>;
  let paymentsRepository: Repository<Payment>;
  let tenantsRepository: Repository<Tenant>;
  let reportsGenerator: ReportsGenerator;

  const mockBillsRepository = {
    find: jest.fn(),
  };

  const mockPaymentsRepository = {
    find: jest.fn(),
  };

  const mockTenantsRepository = {
    findOne: jest.fn(),
  };

  const mockReportsGenerator = {
    generateMonthlyPdfReport: jest.fn(),
    generateTenantStatementPdf: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: getRepositoryToken(Bill),
          useValue: mockBillsRepository,
        },
        {
          provide: getRepositoryToken(Payment),
          useValue: mockPaymentsRepository,
        },
        {
          provide: getRepositoryToken(Tenant),
          useValue: mockTenantsRepository,
        },
        {
          provide: ReportsGenerator,
          useValue: mockReportsGenerator,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    billsRepository = module.get<Repository<Bill>>(getRepositoryToken(Bill));
    paymentsRepository = module.get<Repository<Payment>>(
      getRepositoryToken(Payment),
    );
    tenantsRepository = module.get<Repository<Tenant>>(
      getRepositoryToken(Tenant),
    );
    reportsGenerator = module.get<ReportsGenerator>(ReportsGenerator);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateMonthlyPdfReport', () => {
    it('should generate a monthly PDF report', async () => {
      const year = 2023;
      const month = 5;
      const mockBills = [{ id: 1, year, month }];
      const mockPayments = [{ id: 1, date: new Date(2023, 4, 15) }];
      const mockPdfBuffer = Buffer.from('pdf content');

      mockBillsRepository.find.mockResolvedValue(mockBills);
      mockPaymentsRepository.find.mockResolvedValue(mockPayments);
      mockReportsGenerator.generateMonthlyPdfReport.mockResolvedValue(
        mockPdfBuffer,
      );

      const result = await service.generateMonthlyPdfReport(year, month);

      expect(billsRepository.find).toHaveBeenCalledWith({
        where: { year, month },
        relations: ['tenant'],
      });
      expect(paymentsRepository.find).toHaveBeenCalledWith({
        where: {
          date: expect.any(Object), // Using Between requires special handling in tests
        },
        relations: ['tenant'],
      });
      expect(reportsGenerator.generateMonthlyPdfReport).toHaveBeenCalledWith(
        mockBills,
        mockPayments,
        year,
        month,
      );
      expect(result).toBe(mockPdfBuffer);
    });
  });

  describe('generateTenantStatement', () => {
    it('should generate a tenant statement', async () => {
      const tenantId = 1;
      const startDate = new Date(2023, 0, 1); // January 1, 2023
      const endDate = new Date(2023, 11, 31); // December 31, 2023
      const mockTenant = { id: tenantId, name: 'Test Tenant' };
      const mockBills = [{ id: 1, tenant_id: tenantId }];
      const mockPayments = [
        { id: 1, tenant_id: tenantId, date: new Date(2023, 5, 15) },
      ];
      const mockPdfBuffer = Buffer.from('pdf content');

      mockTenantsRepository.findOne.mockResolvedValue(mockTenant);
      mockBillsRepository.find.mockResolvedValue(mockBills);
      mockPaymentsRepository.find.mockResolvedValue(mockPayments);
      mockReportsGenerator.generateTenantStatementPdf.mockResolvedValue(
        mockPdfBuffer,
      );

      const result = await service.generateTenantStatement(
        tenantId,
        startDate,
        endDate,
      );

      expect(tenantsRepository.findOne).toHaveBeenCalledWith({
        where: { id: tenantId },
        relations: ['apartment'],
      });
      expect(billsRepository.find).toHaveBeenCalled();
      expect(paymentsRepository.find).toHaveBeenCalledWith({
        where: {
          tenant_id: tenantId,
          date: expect.any(Object), // Using Between requires special handling in tests
        },
      });
      expect(reportsGenerator.generateTenantStatementPdf).toHaveBeenCalledWith(
        mockTenant,
        mockBills,
        mockPayments,
        startDate,
        endDate,
      );
      expect(result).toBe(mockPdfBuffer);
    });

    it('should throw an error if tenant is not found', async () => {
      const tenantId = 999; // Non-existent tenant
      const startDate = new Date(2023, 0, 1);
      const endDate = new Date(2023, 11, 31);

      mockTenantsRepository.findOne.mockResolvedValue(null);

      await expect(
        service.generateTenantStatement(tenantId, startDate, endDate),
      ).rejects.toThrow('Tenant not found');
    });
  });

  describe('saveReportToFile', () => {
    it('should save report to file', async () => {
      const pdfBuffer = Buffer.from('pdf content');
      const filename = 'test-report.pdf';
      const mockFilePath = 'reports/test-report.pdf';

      // Mock process.cwd()
      jest.spyOn(process, 'cwd').mockReturnValue('/app');

      // Mock path.join
      const joinSpy = jest
        .spyOn(path, 'join')
        .mockReturnValueOnce('/app/reports') // For the directory path
        .mockReturnValueOnce(mockFilePath); // For the file path

      const result = await service.saveReportToFile(pdfBuffer, filename);

      expect(fs.ensureDir).toHaveBeenCalledWith('/app/reports');
      expect(fs.writeFile).toHaveBeenCalledWith(mockFilePath, pdfBuffer);
      expect(result).toBe(mockFilePath);
    });
  });
});
