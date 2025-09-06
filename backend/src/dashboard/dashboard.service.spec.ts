import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { BillsService } from '../bills/bills.service';
import { PaymentsService } from '../payments/payments.service';

describe('DashboardService', () => {
  let service: DashboardService;
  let billsService: BillsService;
  let paymentsService: PaymentsService;

  const mockBillsService = {
    findAll: jest.fn(),
  };

  const mockPaymentsService = {
    getMonthlyPaymentSummary: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: BillsService,
          useValue: mockBillsService,
        },
        {
          provide: PaymentsService,
          useValue: mockPaymentsService,
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    billsService = module.get<BillsService>(BillsService);
    paymentsService = module.get<PaymentsService>(PaymentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getFinancialSummary', () => {
    it('should return financial summary data', async () => {
      const year = 2023;
      const month = 5;
      const mockBills = [
        {
          id: 1,
          tenant_id: 1,
          tenant: { name: 'Test Tenant 1' },
          total: 1000,
        },
        {
          id: 2,
          tenant_id: 2,
          tenant: { name: 'Test Tenant 2' },
          total: 1500,
        },
      ];

      const mockPayments = [
        { tenantId: 1, totalAmount: 1000 },
        { tenantId: 2, totalAmount: 500 },
      ];

      mockBillsService.findAll.mockResolvedValue(mockBills);
      mockPaymentsService.getMonthlyPaymentSummary.mockResolvedValue(
        mockPayments,
      );

      const result = await service.getFinancialSummary(year, month);

      expect(billsService.findAll).toHaveBeenCalledWith(null, year, month);
      expect(paymentsService.getMonthlyPaymentSummary).toHaveBeenCalledWith(
        year,
        month,
      );

      expect(result).toEqual({
        year,
        month,
        totalExpected: 2500,
        totalCollected: 1500,
        outstanding: 1000,
        collectionRate: 60, // 1500/2500 * 100
        tenantPaymentStatuses: expect.any(Array),
      });

      // Check tenant statuses
      expect(result.tenantPaymentStatuses).toHaveLength(2);
      expect(result.tenantPaymentStatuses[0].status).toBe('Paid');
      expect(result.tenantPaymentStatuses[1].status).toBe('Partial');
    });

    it('should handle case with no bills or payments', async () => {
      mockBillsService.findAll.mockResolvedValue([]);
      mockPaymentsService.getMonthlyPaymentSummary.mockResolvedValue([]);

      const result = await service.getFinancialSummary(2023, 6);

      expect(result).toEqual({
        year: 2023,
        month: 6,
        totalExpected: 0,
        totalCollected: 0,
        outstanding: 0,
        collectionRate: 0,
        tenantPaymentStatuses: [],
      });
    });
  });

  describe('getTenantStatuses', () => {
    it('should return tenant payment statuses', async () => {
      const year = 2023;
      const month = 5;
      const mockBills = [
        {
          id: 1,
          tenant_id: 1,
          tenant: { name: 'Test Tenant 1' },
          total: 1000,
        },
        {
          id: 2,
          tenant_id: 2,
          tenant: { name: 'Test Tenant 2' },
          total: 1500,
        },
        {
          id: 3,
          tenant_id: 3,
          tenant: { name: 'Test Tenant 3' },
          total: 2000,
        },
      ];

      const mockPayments = [
        { tenantId: 1, totalAmount: 1000 }, // Fully paid
        { tenantId: 2, totalAmount: 500 }, // Partial payment
        // Tenant 3 has no payment
      ];

      mockBillsService.findAll.mockResolvedValue(mockBills);
      mockPaymentsService.getMonthlyPaymentSummary.mockResolvedValue(
        mockPayments,
      );

      const result = await service.getTenantStatuses(year, month);

      expect(billsService.findAll).toHaveBeenCalledWith(null, year, month);
      expect(paymentsService.getMonthlyPaymentSummary).toHaveBeenCalledWith(
        year,
        month,
      );

      expect(result).toHaveLength(3);

      // Check tenant payment statuses
      const tenant1 = result.find((t) => t.tenantId === 1);
      const tenant2 = result.find((t) => t.tenantId === 2);
      const tenant3 = result.find((t) => t.tenantId === 3);

      expect(tenant1.status).toBe('Paid');
      expect(tenant1.remainingAmount).toBe(0);

      expect(tenant2.status).toBe('Partial');
      expect(tenant2.remainingAmount).toBe(1000);

      expect(tenant3.status).toBe('Due');
      expect(tenant3.remainingAmount).toBe(2000);
    });
  });

  describe('getYearlySummary', () => {
    it('should return yearly summary with monthly data', async () => {
      const year = 2023;

      // Mock implementation for each month
      mockBillsService.findAll.mockImplementation((_, yr, mth) => {
        // Return different bill amounts for different months
        const totalAmount = 1000 * mth;
        return [{ total: totalAmount }];
      });

      mockPaymentsService.getMonthlyPaymentSummary.mockImplementation(
        (yr, mth) => {
          // Return partial payments for each month (75% of bill amount)
          const totalAmount = 750 * mth;
          return [{ totalAmount }];
        },
      );

      const result = await service.getYearlySummary(year);

      // Expect 12 calls to findAll and getMonthlyPaymentSummary (one for each month)
      expect(billsService.findAll).toHaveBeenCalledTimes(12);
      expect(paymentsService.getMonthlyPaymentSummary).toHaveBeenCalledTimes(
        12,
      );

      // Check structure of result
      expect(result).toEqual({
        year,
        months: expect.any(Array),
        yearTotalExpected: 78000, // Sum of 1000*1 + 1000*2 + ... + 1000*12
        yearTotalCollected: 58500, // Sum of 750*1 + 750*2 + ... + 750*12
      });

      // Check that we have data for all 12 months
      expect(result.months).toHaveLength(12);

      // Check data for first month
      expect(result.months[0]).toEqual({
        month: 1,
        totalExpected: 1000,
        totalCollected: 750,
        outstanding: 250,
      });

      // Check data for last month
      expect(result.months[11]).toEqual({
        month: 12,
        totalExpected: 12000,
        totalCollected: 9000,
        outstanding: 3000,
      });
    });
  });

  describe('getTenantPaymentStatuses', () => {
    it('should calculate correct payment statuses for tenants', async () => {
      const mockBills = [
        { tenant_id: 1, tenant: { name: 'Tenant 1' }, total: 1000 },
        { tenant_id: 2, tenant: { name: 'Tenant 2' }, total: 1500 },
        { tenant_id: 3, tenant: { name: 'Tenant 3' }, total: 2000 },
      ];

      const mockPayments = [
        { tenantId: 1, totalAmount: 1000 }, // Fully paid
        { tenantId: 2, totalAmount: 750 }, // Partially paid
        // Tenant 3 has no payment (Due)
      ];

      const result = await service.getTenantPaymentStatuses(
        mockBills,
        mockPayments,
      );

      expect(result).toHaveLength(3);

      // Check individual tenant statuses
      const tenant1 = result.find((t) => t.tenantId === 1);
      const tenant2 = result.find((t) => t.tenantId === 2);
      const tenant3 = result.find((t) => t.tenantId === 3);

      expect(tenant1).toEqual({
        tenantId: 1,
        tenantName: 'Tenant 1',
        billAmount: 1000,
        paidAmount: 1000,
        remainingAmount: 0,
        status: 'Paid',
        daysSinceLastPayment: null,
      });

      expect(tenant2).toEqual({
        tenantId: 2,
        tenantName: 'Tenant 2',
        billAmount: 1500,
        paidAmount: 750,
        remainingAmount: 750,
        status: 'Partial',
        daysSinceLastPayment: null,
      });

      expect(tenant3).toEqual({
        tenantId: 3,
        tenantName: 'Tenant 3',
        billAmount: 2000,
        paidAmount: 0,
        remainingAmount: 2000,
        status: 'Due',
        daysSinceLastPayment: null,
      });
    });

    it('should handle case with no tenant name', async () => {
      const mockBills = [
        { tenant_id: 1, total: 1000 }, // No tenant object
      ];

      const mockPayments = [{ tenantId: 1, totalAmount: 500 }];

      const result = await service.getTenantPaymentStatuses(
        mockBills,
        mockPayments,
      );

      expect(result).toHaveLength(1);
      expect(result[0].tenantName).toBe('Tenant #1');
      expect(result[0].status).toBe('Partial');
    });
  });
});
