import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentsService } from './payments.service';
import { Payment } from '../entities/payment.entity';
import { TenantsService } from '../tenants/tenants.service';
import { CreatePaymentDto } from '../dto/payment/create-payment.dto';
import { UpdatePaymentDto } from '../dto/payment/update-payment.dto';

describe('PaymentsService - Specialized Queries', () => {
  let service: PaymentsService;
  let paymentsRepository: Repository<Payment>;
  let tenantsService: TenantsService;
  let mockQueryBuilder: any;

  // Create mock for QueryBuilder that correctly returns itself for method chaining
  const createQueryBuilderMock = () => {
    const mock = {
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      innerJoin: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      addGroupBy: jest.fn().mockReturnThis(),
      getRawOne: jest.fn(),
      getRawMany: jest.fn(),
    };
    return mock;
  };

  const mockPaymentsRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockTenantsService = {
    findOne: jest.fn(),
    update: jest.fn(),
    getRemainingBalance: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    // Create a new query builder mock for each test
    mockQueryBuilder = createQueryBuilderMock();
    mockPaymentsRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: getRepositoryToken(Payment),
          useValue: mockPaymentsRepository,
        },
        {
          provide: TenantsService,
          useValue: mockTenantsService,
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    paymentsRepository = module.get<Repository<Payment>>(
      getRepositoryToken(Payment),
    );
    tenantsService = module.get<TenantsService>(TenantsService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTotalPaymentsByTenantId', () => {
    it('should return the total payments for a tenant', async () => {
      const tenantId = 42;
      const expectedTotal = 2500.75;

      mockQueryBuilder.getRawOne.mockResolvedValue({
        total: expectedTotal.toString(),
      });

      const result = await service.getTotalPaymentsByTenantId(tenantId);

      expect(result).toBe(expectedTotal);
      expect(paymentsRepository.createQueryBuilder).toHaveBeenCalledWith(
        'payment',
      );
      expect(mockQueryBuilder.select).toHaveBeenCalledWith(
        'SUM(payment.amount)',
        'total',
      );
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'payment.tenant_id = :tenantId',
        { tenantId },
      );
      expect(mockQueryBuilder.getRawOne).toHaveBeenCalled();
    });

    it('should return 0 when no payments exist', async () => {
      const tenantId = 42;

      mockQueryBuilder.getRawOne.mockResolvedValue({ total: null });

      const result = await service.getTotalPaymentsByTenantId(tenantId);

      expect(result).toBe(0);
    });

    it('should parse string results to float', async () => {
      const tenantId = 42;
      const rawTotal = '1234.56';

      mockQueryBuilder.getRawOne.mockResolvedValue({ total: rawTotal });

      const result = await service.getTotalPaymentsByTenantId(tenantId);

      expect(result).toBe(1234.56);
      expect(typeof result).toBe('number');
    });
  });

  describe('getMonthlyPaymentSummary', () => {
    it('should return monthly payment summary for a specific month/year', async () => {
      const year = 2025;
      const month = 8;
      const expectedSummary = [
        {
          tenantId: 1,
          totalAmount: '1500.00',
          tenant_name: 'John Doe',
        },
        {
          tenantId: 2,
          totalAmount: '1200.50',
          tenant_name: 'Jane Smith',
        },
      ];

      mockQueryBuilder.getRawMany.mockResolvedValue(expectedSummary);

      const result = await service.getMonthlyPaymentSummary(year, month);

      expect(result).toEqual(expectedSummary);
      expect(paymentsRepository.createQueryBuilder).toHaveBeenCalledWith(
        'payment',
      );
      expect(mockQueryBuilder.select).toHaveBeenCalledWith(
        'payment.tenant_id',
        'tenantId',
      );
      expect(mockQueryBuilder.addSelect).toHaveBeenCalledWith(
        'SUM(payment.amount)',
        'totalAmount',
      );
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'payment.tenant',
        'tenant',
      );
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'payment.date BETWEEN :startDate AND :endDate',
        {
          startDate: new Date(year, month - 1, 1),
          endDate: new Date(year, month, 0),
        },
      );
      expect(mockQueryBuilder.groupBy).toHaveBeenCalledWith(
        'payment.tenant_id',
      );
      expect(mockQueryBuilder.addGroupBy).toHaveBeenCalledWith('tenant.name');
      expect(mockQueryBuilder.getRawMany).toHaveBeenCalled();
    });

    it('should return empty array when no payments exist for the month', async () => {
      mockQueryBuilder.getRawMany.mockResolvedValue([]);

      const result = await service.getMonthlyPaymentSummary(2025, 9);

      expect(result).toEqual([]);
    });
  });

  describe('getTenantPaymentHistory', () => {
    it('should return formatted payment history for a tenant', async () => {
      const tenantId = 42;
      const payments = [
        {
          id: 1,
          date: new Date('2025-01-15'),
          amount: 1500,
          remaining_balance: 500,
          payment_method: 'Credit Card',
          reference_number: 'REF12345',
          tenant_id: tenantId,
        },
        {
          id: 2,
          date: new Date('2025-02-15'),
          amount: 1500,
          remaining_balance: 0,
          payment_method: 'Bank Transfer',
          reference_number: 'REF67890',
          tenant_id: tenantId,
        },
      ];

      mockPaymentsRepository.find.mockResolvedValue(payments);

      const result = await service.getTenantPaymentHistory(tenantId);

      expect(result).toEqual([
        {
          payment_id: 1,
          date: payments[0].date,
          amount: 1500,
          remaining_balance: 500,
          payment_method: 'Credit Card',
          reference_number: 'REF12345',
        },
        {
          payment_id: 2,
          date: payments[1].date,
          amount: 1500,
          remaining_balance: 0,
          payment_method: 'Bank Transfer',
          reference_number: 'REF67890',
        },
      ]);

      expect(mockPaymentsRepository.find).toHaveBeenCalledWith({
        where: { tenant_id: tenantId },
        order: { date: 'ASC' },
      });
    });

    it('should handle null remaining_balance in payment history', async () => {
      const tenantId = 42;
      const payments = [
        {
          id: 1,
          date: new Date('2025-01-15'),
          amount: 1500,
          remaining_balance: null, // Null value
          payment_method: 'Cash',
          reference_number: 'REF12345',
          tenant_id: tenantId,
        },
      ];

      mockPaymentsRepository.find.mockResolvedValue(payments);

      const result = await service.getTenantPaymentHistory(tenantId);

      expect(result).toEqual([
        {
          payment_id: 1,
          date: payments[0].date,
          amount: 1500,
          remaining_balance: 0, // Should default to 0
          payment_method: 'Cash',
          reference_number: 'REF12345',
        },
      ]);
    });

    it('should return empty array when tenant has no payment history', async () => {
      const tenantId = 999; // Tenant with no payments
      mockPaymentsRepository.find.mockResolvedValue([]);

      const result = await service.getTenantPaymentHistory(tenantId);

      expect(result).toEqual([]);
    });
  });

  describe('processAdvancePayment', () => {
    it('should set tenant advance payment when payments exceed bill totals', async () => {
      // Tenant with bills
      const tenant = {
        id: 42,
        name: 'John Doe',
        bills: [
          { id: 1, total: 1500, is_paid: false },
          { id: 2, total: 1500, is_paid: true },
        ],
      };

      // Total payments of 3500 exceeds bill totals (3000)
      const getTotalSpy = jest.spyOn(service, 'getTotalPaymentsByTenantId');
      getTotalSpy.mockResolvedValue(3500);

      // Call the private method using type assertion
      await (service as any).processAdvancePayment(tenant);

      // The advance should be 3500 - (1500+1500) = 500
      expect(mockTenantsService.update).toHaveBeenCalledWith(tenant.id, {
        advance_payment: 500,
      });
    });

    it('should not update tenant when there is no advance payment', async () => {
      // Tenant with bills
      const tenant = {
        id: 42,
        name: 'John Doe',
        bills: [
          { id: 1, total: 1500, is_paid: false },
          { id: 2, total: 1500, is_paid: false },
        ],
      };

      // Total payments of 2000 is less than bill totals (3000)
      const getTotalSpy = jest.spyOn(service, 'getTotalPaymentsByTenantId');
      getTotalSpy.mockResolvedValue(2000);

      // Call the private method
      await (service as any).processAdvancePayment(tenant);

      // Should not update tenant as there's no advance
      expect(mockTenantsService.update).not.toHaveBeenCalled();
    });

    it('should handle tenant with no bills', async () => {
      // Tenant with no bills
      const tenant = {
        id: 42,
        name: 'John Doe',
        bills: [],
      };

      // Any payment would be advance
      const getTotalSpy = jest.spyOn(service, 'getTotalPaymentsByTenantId');
      getTotalSpy.mockResolvedValue(1000);

      // Call the private method
      await (service as any).processAdvancePayment(tenant);

      // The full payment should be advance
      expect(mockTenantsService.update).toHaveBeenCalledWith(tenant.id, {
        advance_payment: 1000,
      });
    });

    it('should handle undefined tenant gracefully', async () => {
      // Call with undefined tenant
      const getTotalSpy = jest.spyOn(service, 'getTotalPaymentsByTenantId');

      await (service as any).processAdvancePayment(undefined);

      // Should return early without errors
      expect(getTotalSpy).not.toHaveBeenCalled();
      expect(mockTenantsService.update).not.toHaveBeenCalled();
    });
  });

  describe('calculateRemainingBalance', () => {
    it('should calculate remaining balance from unpaid bills', async () => {
      const tenant = {
        id: 42,
        bills: [
          { id: 1, total: 1500, is_paid: false },
          { id: 2, total: 1000, is_paid: false },
          { id: 3, total: 800, is_paid: true }, // This should be ignored (already paid)
        ],
      };

      const paymentAmount = 1800;

      // Call the private method
      const result = await (service as any).calculateRemainingBalance(
        tenant,
        paymentAmount,
      );

      // Should be (1500+1000) - 1800 = 700
      expect(result).toBe(700);
    });

    it('should return 0 if payment covers all bills', async () => {
      const tenant = {
        id: 42,
        bills: [
          { id: 1, total: 1500, is_paid: false },
          { id: 2, total: 800, is_paid: false },
        ],
      };

      const paymentAmount = 3000; // More than total bills

      const result = await (service as any).calculateRemainingBalance(
        tenant,
        paymentAmount,
      );
      expect(result).toBe(0);
    });

    it('should return 0 for tenant with no bills', async () => {
      const tenant = {
        id: 42,
        bills: [],
      };

      const paymentAmount = 1000;

      const result = await (service as any).calculateRemainingBalance(
        tenant,
        paymentAmount,
      );
      expect(result).toBe(0);
    });

    it('should return 0 if tenant is undefined', async () => {
      const result = await (service as any).calculateRemainingBalance(
        undefined,
        1000,
      );
      expect(result).toBe(0);
    });

    it('should handle bills with string totals', async () => {
      const tenant = {
        id: 42,
        bills: [
          { id: 1, total: '1500.50', is_paid: false }, // String total
          { id: 2, total: '999.99', is_paid: false }, // String total
        ],
      };

      const paymentAmount = 2000;

      const result = await (service as any).calculateRemainingBalance(
        tenant,
        paymentAmount,
      );
      // Should be (1500.50+999.99) - 2000 = ~500.49
      expect(result).toBeCloseTo(500.49, 2);
    });
  });
});
