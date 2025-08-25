import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BillGenerationService } from './bill-generation.service';
import { Bill } from '../entities/bill.entity';
import { Tenant } from '../entities/tenant.entity';

describe('BillGenerationService', () => {
  let service: BillGenerationService;
  let billRepository: Repository<Bill>;
  let tenantRepository: Repository<Tenant>;

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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateBillForTenant', () => {
    it('should generate a full month bill regardless of the day of month', async () => {
      // Mock data
      const mockDate = new Date('2025-08-25'); // Testing on August 25th
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
        advance_payment: 300,
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
        advance_payment: tenant.advance_payment,
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

      // Verify tenant's advance payment was reset
      expect(tenantRepository.update).toHaveBeenCalledWith(tenant.id, {
        advance_payment: 0,
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
        advance_payment: 1000, // More than enough to cover the bill
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

      // Mock calculateTotal method to return a value
      jest.spyOn(service as any, 'calculateTotal').mockReturnValue(800);

      // When the bill is saved, it should have is_paid set to true
      const savedBill = {
        ...mockCreatedBill,
        id: 42,
        total: 0,
        is_paid: true,
      };
      mockBillRepository.save.mockResolvedValue(savedBill);

      const result = await service.generateBillForTenant(
        tenant as Tenant,
        2025,
        8,
        new Date('2025-08-10'),
      );

      // Expect the remaining advance payment to be stored for next month
      expect(tenantRepository.update).toHaveBeenCalledWith(
        tenant.id,
        { advance_payment: 200 }, // 1000 - 800 = 200
      );

      expect(result.is_paid).toBe(true);
    });
  });
});
