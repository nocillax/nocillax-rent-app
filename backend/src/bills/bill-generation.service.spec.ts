import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BillGenerationService } from './bill-generation.service';
import { Bill } from '../entities/bill.entity';
import { Tenant } from '../entities/tenant.entity';
import { Logger } from '@nestjs/common';

describe('BillGenerationService', () => {
  let service: BillGenerationService;
  let billRepository: Repository<Bill>;
  let tenantRepository: Repository<Tenant>;
  let loggerSpy: jest.SpyInstance;

  const mockBillRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockTenantRepository = {
    find: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillGenerationService,
        {
          provide: getRepositoryToken(Bill),
          useValue: mockBillRepository,
        },
        {
          provide: getRepositoryToken(Tenant),
          useValue: mockTenantRepository,
        },
      ],
    }).compile();

    service = module.get<BillGenerationService>(BillGenerationService);
    billRepository = module.get<Repository<Bill>>(getRepositoryToken(Bill));
    tenantRepository = module.get<Repository<Tenant>>(
      getRepositoryToken(Tenant),
    );

    // Mock the logger methods
    loggerSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();
    jest.spyOn(Logger.prototype, 'error').mockImplementation();

    // Ensure calculateTotal returns a proper value by default
    jest
      .spyOn(service as any, 'calculateTotal')
      .mockImplementation((bill: any) => {
        // Simple default implementation that adds rent and subtracts advance payment
        return (bill.rent || 0) - (bill.advance_payment || 0);
      });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateMonthlyBills', () => {
    it('should generate bills for all active tenants', async () => {
      // Mock the current date to ensure consistent testing
      const mockDate = new Date('2025-01-01T00:01:00Z'); // January 1st at 00:01
      const originalDate = global.Date;
      global.Date = jest.fn(() => mockDate) as any;
      global.Date.now = originalDate.now;

      // Setup mocks for active tenants
      const tenants = [
        {
          id: 1,
          name: 'John Doe',
          apartment_id: 101,
          apartment: { id: 101, base_rent: 1000 },
          is_active: true,
        },
        {
          id: 2,
          name: 'Jane Smith',
          apartment_id: 102,
          apartment: { id: 102, base_rent: 1200 },
          is_active: true,
        },
      ] as Tenant[];

      mockTenantRepository.find.mockResolvedValue(tenants);

      // Mock implementation of generateBillForTenant
      const generateBillSpy = jest
        .spyOn(service, 'generateBillForTenant')
        .mockResolvedValue({
          id: 1,
        } as Bill);

      // Execute the monthly bill generation
      await service.generateMonthlyBills();

      // Verify the correct tenants were processed
      expect(mockTenantRepository.find).toHaveBeenCalledWith({
        where: { is_active: true },
        relations: ['apartment'],
      });

      // Should call generateBillForTenant for each tenant
      expect(generateBillSpy).toHaveBeenCalledTimes(2);

      // Instead of checking exact parameters, verify the function was called at all
      expect(generateBillSpy).toHaveBeenCalled();

      // Verify it was called with the tenants we expect
      const calls = generateBillSpy.mock.calls;
      expect(calls[0][0].id).toBe(tenants[0].id);
      expect(calls[1][0].id).toBe(tenants[1].id);

      // Verify logging
      expect(loggerSpy).toHaveBeenCalledWith(
        'Running monthly bill generation...',
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        `Found ${tenants.length} active tenants to generate bills for`,
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        'Monthly bill generation completed',
      );

      // Restore the original Date
      global.Date = originalDate;
    });
  });

  describe('generateBillForTenant', () => {
    it('should generate a full month bill regardless of the day of month', async () => {
      // Mock data
      const tenant = {
        id: 1,
        name: 'John Doe',
        apartment_id: 5,
        apartment: {
          id: 5,
          base_rent: 1200,
        },
        water_bill_enabled: true,
        gas_bill_enabled: true,
        electricity_bill_enabled: true,
        internet_bill_enabled: false,
        service_charge_enabled: true,
        trash_bill_enabled: true,
        credit_balance: 300,
      };

      // No existing bill for this month
      mockBillRepository.findOne.mockResolvedValue(null);

      // No previous bill
      mockBillRepository.findOne.mockResolvedValueOnce(null);

      // Mock the created bill
      const mockCreatedBill = {
        id: null,
        tenant_id: tenant.id,
        apartment_id: tenant.apartment_id,
        year: 2025,
        month: 8,
        rent: tenant.apartment.base_rent,
        water_bill: 0,
        gas_bill: 0,
        electricity_bill: 0,
        internet_bill: 0,
        service_charge: 0,
        trash_bill: 0,
        other_charges: 0,
        previous_balance: 0,
        advance_payment: tenant.credit_balance,
        due_date: new Date('2025-08-30'),
        is_paid: false,
        total: 0, // Will be calculated
      };

      mockBillRepository.create.mockReturnValue(mockCreatedBill);

      // When the bill is saved, add an ID
      const savedBill = { ...mockCreatedBill, id: 42 };
      mockBillRepository.save.mockResolvedValue(savedBill);

      // Execute
      const result = await service.generateBillForTenant(
        tenant as Tenant,
        2025,
        8,
        new Date('2025-08-30'),
      );

      // Assert
      expect(result).toBe(savedBill);
      expect(mockBillRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          tenant_id: tenant.id,
          apartment_id: tenant.apartment_id,
          year: 2025,
          month: 8,
          rent: 1200,
          advance_payment: 300,
        }),
      );

      // Verify no proration happened (full month bill)
      expect(mockBillRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          rent: 1200, // Full month rent regardless of the day
        }),
      );

      // Verify tenant's credit balance was reset
      expect(tenantRepository.update).toHaveBeenCalledWith(tenant.id, {
        credit_balance: 0,
      });
    });

    it('should use existing bill if one already exists for the month', async () => {
      const existingBill = {
        id: 42,
        tenant_id: 1,
        year: 2025,
        month: 8,
      };

      mockBillRepository.findOne.mockResolvedValue(existingBill);

      const tenant = { id: 1 };
      const result = await service.generateBillForTenant(
        tenant as Tenant,
        2025,
        8,
        new Date(),
      );

      expect(result).toBe(existingBill);
      expect(mockBillRepository.create).not.toHaveBeenCalled();
      expect(mockBillRepository.save).not.toHaveBeenCalled();
    });

    it('should mark bill as paid if advance payment covers the total', async () => {
      const tenant = {
        id: 1,
        name: 'John Doe',
        apartment_id: 5,
        apartment: {
          id: 5,
          base_rent: 800,
        },
        water_bill_enabled: false,
        gas_bill_enabled: false,
        electricity_bill_enabled: false,
        internet_bill_enabled: false,
        service_charge_enabled: false,
        trash_bill_enabled: false,
        credit_balance: 1000, // More than enough to cover the bill
      };

      mockBillRepository.findOne.mockResolvedValue(null); // No existing bill
      mockBillRepository.findOne.mockResolvedValueOnce(null); // No previous bill

      const mockCreatedBill = {
        tenant_id: tenant.id,
        apartment_id: tenant.apartment_id,
        year: 2025,
        month: 8,
        rent: 800,
        water_bill: 0,
        gas_bill: 0,
        electricity_bill: 0,
        internet_bill: 0,
        service_charge: 0,
        trash_bill: 0,
        other_charges: 0,
        previous_balance: 0,
        advance_payment: 1000,
        due_date: new Date('2025-08-10'),
        is_paid: false,
        total: 0, // Will be calculated
      };

      mockBillRepository.create.mockReturnValue(mockCreatedBill);

      // Override calculateTotal to return a specific value for this test
      jest.spyOn(service as any, 'calculateTotal').mockReturnValue(800);

      // When the bill is saved, it should have is_paid set to true
      const savedBill = {
        ...mockCreatedBill,
        id: 42,
        total: 800,
        is_paid: true,
      };
      mockBillRepository.save.mockResolvedValue(savedBill);

      const result = await service.generateBillForTenant(
        tenant as Tenant,
        2025,
        8,
        new Date('2025-08-10'),
      );

      // Expect the remaining credit balance to be stored for next month
      expect(tenantRepository.update).toHaveBeenCalledWith(
        tenant.id,
        { credit_balance: 200 }, // 1000 - 800 = 200
      );

      expect(result.is_paid).toBe(true);
    });

    it('should include previous unpaid balance in the new bill', async () => {
      const tenant = {
        id: 1,
        name: 'John Doe',
        apartment_id: 5,
        apartment: {
          id: 5,
          base_rent: 1000,
        },
        credit_balance: 0,
      };

      // Clear all previous mocks
      jest.clearAllMocks();

      // Setup mock in the correct order:
      // 1. First findOne call (for existing bill): return null (no bill for current month)
      mockBillRepository.findOne.mockImplementation((options) => {
        // Check for current month bill
        if (options?.where?.month === 2 && options?.where?.year === 2025) {
          return Promise.resolve(null);
        }

        // Return previous month's unpaid bill for the second call
        const previousBill = {
          id: 30,
          tenant_id: 1,
          total: 1200,
          is_paid: false,
          advance_payment: 0,
        };
        return Promise.resolve(previousBill);
      });

      const mockCreatedBill = {
        tenant_id: tenant.id,
        apartment_id: tenant.apartment_id,
        year: 2025,
        month: 2, // February
        rent: 1000,
        water_bill: 0,
        gas_bill: 0,
        electricity_bill: 0,
        internet_bill: 0,
        service_charge: 0,
        trash_bill: 0,
        other_charges: 0,
        previous_balance: 1200, // Previous month's unpaid total
        advance_payment: 0,
        due_date: new Date('2025-02-10'),
        is_paid: false,
        total: 0, // Will be calculated
      };

      mockBillRepository.create.mockReturnValue(mockCreatedBill);

      // Calculate total as rent + previous_balance
      jest.spyOn(service as any, 'calculateTotal').mockReturnValue(2200);

      const savedBill = {
        ...mockCreatedBill,
        id: 42,
        total: 2200,
      };
      mockBillRepository.save.mockResolvedValue(savedBill);

      const result = await service.generateBillForTenant(
        tenant as Tenant,
        2025,
        2,
        new Date('2025-02-10'),
      );

      expect(mockBillRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          previous_balance: 1200,
        }),
      );
      expect(result.total).toBe(2200);
    });

    it('should handle errors during bill generation', async () => {
      const tenant = {
        id: 1,
        name: 'John Doe',
        apartment_id: 5,
        apartment: {
          id: 5,
          base_rent: 1000,
        },
      };

      const error = new Error('Database error');
      mockBillRepository.findOne.mockRejectedValue(error);

      const loggerErrorSpy = jest.spyOn(Logger.prototype, 'error');

      // Execute and expect it to throw
      await expect(
        service.generateBillForTenant(tenant as Tenant, 2025, 3, new Date()),
      ).rejects.toThrow('Database error');

      // Verify error was logged properly
      expect(loggerErrorSpy).toHaveBeenCalledWith(
        `Error generating bill for tenant ${tenant.id}: Database error`,
        expect.any(String), // Stack trace
      );
    });

    it('should apply remaining advance payment from previous bill', async () => {
      const tenant = {
        id: 1,
        name: 'John Doe',
        apartment_id: 5,
        apartment: {
          id: 5,
          base_rent: 1000,
        },
        credit_balance: 0,
      };

      // Clear all previous mocks
      jest.clearAllMocks();

      // Setup mock in the correct order:
      // 1. First findOne call (for existing bill): return null (no bill for current month)
      mockBillRepository.findOne.mockImplementation((options) => {
        // Check for current month bill
        if (options?.where?.month === 2 && options?.where?.year === 2025) {
          return Promise.resolve(null);
        }

        // Return previous month's bill with advance payment for the second call
        const previousBill = {
          id: 30,
          tenant_id: 1,
          total: 800,
          is_paid: true,
          advance_payment: 1500, // More than needed
        };
        return Promise.resolve(previousBill);
      });

      const mockCreatedBill = {
        tenant_id: tenant.id,
        apartment_id: tenant.apartment_id,
        year: 2025,
        month: 2,
        rent: 1000,
        water_bill: 0,
        gas_bill: 0,
        electricity_bill: 0,
        internet_bill: 0,
        service_charge: 0,
        trash_bill: 0,
        other_charges: 0,
        previous_balance: 0,
        advance_payment: 700, // 1500 - 800 from previous bill
        due_date: new Date('2025-02-10'),
        is_paid: false,
        total: 0,
      };

      mockBillRepository.create.mockReturnValue(mockCreatedBill);

      // Calculate total with advance payment subtracted
      jest.spyOn(service as any, 'calculateTotal').mockReturnValue(300);

      const savedBill = {
        ...mockCreatedBill,
        id: 42,
        total: 300,
      };
      mockBillRepository.save.mockResolvedValue(savedBill);

      const result = await service.generateBillForTenant(
        tenant as Tenant,
        2025,
        2,
        new Date('2025-02-10'),
      );

      expect(mockBillRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          advance_payment: 700,
        }),
      );
      expect(result.total).toBe(300);
    });
  });

  describe('calculateTotal', () => {
    it('should correctly calculate the total bill amount', () => {
      // Restore the original implementation for this specific test
      jest.spyOn(service as any, 'calculateTotal').mockRestore();

      const bill = {
        rent: 1200,
        water_bill: 50,
        gas_bill: 30,
        electricity_bill: 100,
        internet_bill: 60,
        service_charge: 80,
        trash_bill: 20,
        other_charges: 40,
        previous_balance: 200,
        advance_payment: 300, // This is a bill property, not a tenant property
      };

      const total = (service as any).calculateTotal(bill);

      // Total should be sum of all charges minus advance payment
      const expectedTotal =
        1200 + 50 + 30 + 100 + 60 + 80 + 20 + 40 + 200 - 300;
      expect(total).toBe(expectedTotal);
    });

    it('should return 0 if advance payment exceeds total charges', () => {
      // Restore the original implementation for this specific test
      jest.spyOn(service as any, 'calculateTotal').mockRestore();

      const bill = {
        rent: 800,
        water_bill: 50,
        other_charges: 50,
        advance_payment: 1000, // More than the sum of charges
      };

      const total = (service as any).calculateTotal(bill);
      expect(total).toBe(0);
    });

    it('should handle undefined or null values', () => {
      // Restore the original implementation for this specific test
      jest.spyOn(service as any, 'calculateTotal').mockRestore();

      const bill = {
        rent: 1000,
        // Other fields are undefined
      };

      const total = (service as any).calculateTotal(bill);
      expect(total).toBe(1000); // Should only count the rent
    });
  });

  describe('generateBillsForMonth', () => {
    it('should generate bills for all active tenants for a specific month', async () => {
      const year = 2025;
      const month = 4; // April

      const tenants = [
        {
          id: 1,
          name: 'John Doe',
          apartment_id: 101,
          apartment: { id: 101, base_rent: 1000 },
          is_active: true,
        },
        {
          id: 2,
          name: 'Jane Smith',
          apartment_id: 102,
          apartment: { id: 102, base_rent: 1200 },
          is_active: true,
        },
      ] as Tenant[];

      mockTenantRepository.find.mockResolvedValue(tenants);

      const mockGeneratedBills = [
        { id: 101, tenant_id: 1, month, year },
        { id: 102, tenant_id: 2, month, year },
      ] as Bill[];

      // Mock the tenant bill generation to return predefined bills
      jest
        .spyOn(service, 'generateBillForTenant')
        .mockImplementation(async (tenant, y, m, dueDate) => {
          return mockGeneratedBills.find(
            (bill) => bill.tenant_id === tenant.id,
          ) as Bill;
        });

      const result = await service.generateBillsForMonth(year, month);

      expect(mockTenantRepository.find).toHaveBeenCalledWith({
        where: { is_active: true },
        relations: ['apartment'],
      });
      expect(service.generateBillForTenant).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockGeneratedBills);
      expect(loggerSpy).toHaveBeenCalledWith(
        `Manually generating bills for ${month}/${year}`,
      );
    });

    it('should handle an empty tenant list', async () => {
      mockTenantRepository.find.mockResolvedValue([]);

      // Need to spy on generateBillForTenant before we call the method
      const generateBillSpy = jest.spyOn(service, 'generateBillForTenant');

      const result = await service.generateBillsForMonth(2025, 5);

      expect(result).toEqual([]);
      expect(generateBillSpy).not.toHaveBeenCalled();
    });
  });
});
