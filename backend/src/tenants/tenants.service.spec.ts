import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TenantsService } from './tenants.service';
import { Tenant } from '../entities/tenant.entity';
import { ApartmentsService } from '../apartments/apartments.service';
import { ClosurePreviewDto } from '../dto/tenant/closure-preview.dto';
import { TenantClosureDto } from '../dto/tenant/tenant-closure.dto';

describe('TenantsService', () => {
  let service: TenantsService;
  let tenantRepository: Repository<Tenant>;

  const mockTenantRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockApartmentsService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantsService,
        {
          provide: getRepositoryToken(Tenant),
          useValue: mockTenantRepository,
        },
        {
          provide: ApartmentsService,
          useValue: mockApartmentsService,
        },
      ],
    }).compile();

    service = module.get<TenantsService>(TenantsService);
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

  describe('previewClosure', () => {
    it('should calculate closure preview correctly', async () => {
      // Setup mock data
      const tenantId = 1;
      const tenant = {
        id: tenantId,
        name: 'John Doe',
        security_deposit: 2000,
        advance_payment: 500,
        bills: [
          { total: 1200, is_paid: true },
          { total: 1300, is_paid: false },
          { total: 1250, is_paid: false },
        ],
        payments: [
          { amount: 1200 },
          { amount: 300 }, // Partial payment on one bill
        ],
      };

      const previewData: ClosurePreviewDto = {
        estimated_deductions: 300,
        deduction_reason: 'Minor repairs and cleaning',
      };

      // Mock repository response
      mockTenantRepository.findOne.mockResolvedValue(tenant);

      // Execute
      const result = await service.previewClosure(tenantId, previewData);

      // Calculate expected values
      // Total bills: 1200 (paid) + 1300 (unpaid) + 1250 (unpaid) = 3750
      // Total payments: 1200 + 300 = 1500
      // Outstanding balance: 3750 - 1500 = 2250
      // Final balance due after using advance: 2250 - 500 = 1750
      // Refund amount: security deposit (2000) - deductions (300) - final balance (1750) = 0 (since it's negative)

      // Assert
      expect(result).toEqual({
        tenant_id: tenantId,
        tenant_name: 'John Doe',
        security_deposit: 2000,
        estimated_deductions: 300,
        deduction_reason: 'Minor repairs and cleaning',
        advance_payment: 500,
        outstanding_balance: 2250,
        final_balance_due: 1750,
        potential_refund: 0,
        preview_date: expect.any(Date),
        is_preview: true,
      });
    });

    it('should handle case where tenant is entitled to a refund', async () => {
      // Setup mock data
      const tenantId = 1;
      const tenant = {
        id: tenantId,
        name: 'Jane Smith',
        security_deposit: 2000,
        advance_payment: 1000,
        bills: [
          { total: 1200, is_paid: true },
          { total: 800, is_paid: false },
        ],
        payments: [{ amount: 1200 }],
      };

      const previewData: ClosurePreviewDto = {
        estimated_deductions: 200,
        deduction_reason: 'Minor cleaning',
      };

      // Mock repository response
      mockTenantRepository.findOne.mockResolvedValue(tenant);

      // Execute
      const result = await service.previewClosure(tenantId, previewData);

      // Calculate expected values
      // Total bills: 1200 (paid) + 800 (unpaid) = 2000
      // Total payments: 1200
      // Outstanding balance: 2000 - 1200 = 800
      // Advance covers all outstanding: 1000 - 800 = 200 remaining advance
      // Final balance due: 0 (advance covered it)
      // Refund: remaining advance (200) + security deposit after deductions (1800) = 2000

      // Assert
      expect(result).toEqual({
        tenant_id: tenantId,
        tenant_name: 'Jane Smith',
        security_deposit: 2000,
        estimated_deductions: 200,
        deduction_reason: 'Minor cleaning',
        advance_payment: 1000,
        outstanding_balance: 800,
        final_balance_due: 0,
        potential_refund: 2000,
        preview_date: expect.any(Date),
        is_preview: true,
      });
    });
  });

  describe('processTenantClosure', () => {
    it('should process tenant closure and update tenant status', async () => {
      // Setup mock data
      const tenantId = 1;
      const tenant = {
        id: tenantId,
        name: 'John Doe',
        security_deposit: 2000,
        advance_payment: 500,
        bills: [
          { total: 1200, is_paid: true },
          { total: 1300, is_paid: false },
        ],
        payments: [
          { amount: 1200 },
          { amount: 300 }, // Partial payment on second bill
        ],
      };

      const closureData: TenantClosureDto = {
        deposit_deductions: 300,
        deduction_reason: 'Minor repairs and cleaning',
      };

      // Mock repository responses
      mockTenantRepository.findOne.mockResolvedValue(tenant);

      // Execute
      const result = await service.processTenantClosure(tenantId, closureData);

      // Calculate expected values
      // Total bills: 1200 (paid) + 1300 (unpaid) = 2500
      // Total payments: 1200 + 300 = 1500
      // Outstanding balance: 2500 - 1500 = 1000
      // After using advance payment: 1000 - 500 = 500
      // After using security deposit (minus deductions): 500 - (2000 - 300) = -1200
      // Final refund: 1200

      // Assert
      expect(result).toEqual({
        tenant_id: tenantId,
        tenant_name: 'John Doe',
        security_deposit: 2000,
        deposit_deductions: 300,
        deduction_reason: 'Minor repairs and cleaning',
        advance_payment: 500,
        outstanding_balance: 1000,
        final_balance_due: 0,
        refund_amount: 1200,
        closure_date: expect.any(Date),
        is_preview: false,
      });

      // Verify the tenant was marked as inactive and payments were reset
      expect(mockTenantRepository.update).toHaveBeenCalledWith(tenantId, {
        is_active: false,
        advance_payment: 0,
        security_deposit: 0,
      });
    });
  });
});
