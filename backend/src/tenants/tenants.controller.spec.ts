import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { TenantsController } from './tenants.controller';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from '../dto/tenant/create-tenant.dto';
import { UpdateTenantDto } from '../dto/tenant/update-tenant.dto';
import { TenantBillPreferencesDto } from '../dto/tenant/bill-preferences.dto';
import { ClosurePreviewDto } from '../dto/tenant/closure-preview.dto';
import { TenantClosureDto } from '../dto/tenant/tenant-closure.dto';

describe('TenantsController', () => {
  let controller: TenantsController;
  let service: TenantsService;

  const mockTenantsService = {
    findAll: jest.fn(),
    findArchived: jest.fn(),
    findOne: jest.fn(),
    findBills: jest.fn(),
    findPayments: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    archive: jest.fn(),
    updateBillPreferences: jest.fn(),
    remove: jest.fn(),
    previewClosure: jest.fn(),
    processTenantClosure: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenantsController],
      providers: [
        {
          provide: TenantsService,
          useValue: mockTenantsService,
        },
      ],
    }).compile();

    controller = module.get<TenantsController>(TenantsController);
    service = module.get<TenantsService>(TenantsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all active tenants when no filter is provided', async () => {
      const expectedTenants = [
        { id: 1, name: 'John Doe', is_active: true },
        { id: 2, name: 'Jane Smith', is_active: true },
      ];
      mockTenantsService.findAll.mockResolvedValue(expectedTenants);

      const result = await controller.findAll();

      expect(result).toBe(expectedTenants);
      expect(mockTenantsService.findAll).toHaveBeenCalledWith(undefined);
    });

    it('should filter tenants by apartment ID when provided', async () => {
      const apartmentId = 5;
      const expectedTenants = [
        { id: 1, name: 'John Doe', apartment_id: 5, is_active: true },
      ];
      mockTenantsService.findAll.mockResolvedValue(expectedTenants);

      const result = await controller.findAll(apartmentId);

      expect(result).toBe(expectedTenants);
      expect(mockTenantsService.findAll).toHaveBeenCalledWith(apartmentId);
    });
  });

  describe('findArchived', () => {
    it('should return all archived tenants', async () => {
      const archivedTenants = [
        { id: 3, name: 'Former Tenant', is_active: false },
        { id: 4, name: 'Old Tenant', is_active: false },
      ];
      mockTenantsService.findArchived.mockResolvedValue(archivedTenants);

      const result = await controller.findArchived();

      expect(result).toBe(archivedTenants);
      expect(mockTenantsService.findArchived).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a tenant when it exists', async () => {
      const tenantId = 1;
      const expectedTenant = { id: tenantId, name: 'John Doe' };
      mockTenantsService.findOne.mockResolvedValue(expectedTenant);

      const result = await controller.findOne(tenantId);

      expect(result).toBe(expectedTenant);
      expect(mockTenantsService.findOne).toHaveBeenCalledWith(tenantId);
    });

    it('should throw an exception when tenant does not exist', async () => {
      const tenantId = 999;
      mockTenantsService.findOne.mockResolvedValue(null);

      await expect(controller.findOne(tenantId)).rejects.toThrow(HttpException);
      expect(mockTenantsService.findOne).toHaveBeenCalledWith(tenantId);
    });
  });

  describe('findBills', () => {
    it('should return bills for a tenant', async () => {
      const tenantId = 1;
      const tenant = { id: tenantId, name: 'John Doe' };
      const expectedBills = [
        { id: 101, tenant_id: tenantId, amount: 1200 },
        { id: 102, tenant_id: tenantId, amount: 1250 },
      ];

      mockTenantsService.findOne.mockResolvedValue(tenant);
      mockTenantsService.findBills.mockResolvedValue(expectedBills);

      const result = await controller.findBills(tenantId);

      expect(result).toBe(expectedBills);
      expect(mockTenantsService.findOne).toHaveBeenCalledWith(tenantId);
      expect(mockTenantsService.findBills).toHaveBeenCalledWith(tenantId);
    });

    it('should throw an exception when tenant does not exist', async () => {
      const tenantId = 999;
      mockTenantsService.findOne.mockResolvedValue(null);

      await expect(controller.findBills(tenantId)).rejects.toThrow(
        HttpException,
      );
      expect(mockTenantsService.findOne).toHaveBeenCalledWith(tenantId);
      expect(mockTenantsService.findBills).not.toHaveBeenCalled();
    });
  });

  describe('findPayments', () => {
    it('should return payments for a tenant', async () => {
      const tenantId = 1;
      const tenant = { id: tenantId, name: 'John Doe' };
      const expectedPayments = [
        { id: 201, tenant_id: tenantId, amount: 1000 },
        { id: 202, tenant_id: tenantId, amount: 1200 },
      ];

      mockTenantsService.findOne.mockResolvedValue(tenant);
      mockTenantsService.findPayments.mockResolvedValue(expectedPayments);

      const result = await controller.findPayments(tenantId);

      expect(result).toBe(expectedPayments);
      expect(mockTenantsService.findOne).toHaveBeenCalledWith(tenantId);
      expect(mockTenantsService.findPayments).toHaveBeenCalledWith(tenantId);
    });

    it('should throw an exception when tenant does not exist', async () => {
      const tenantId = 999;
      mockTenantsService.findOne.mockResolvedValue(null);

      await expect(controller.findPayments(tenantId)).rejects.toThrow(
        HttpException,
      );
      expect(mockTenantsService.findOne).toHaveBeenCalledWith(tenantId);
      expect(mockTenantsService.findPayments).not.toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new tenant', async () => {
      const createTenantDto: CreateTenantDto = {
        name: 'New Tenant',
        phone_number: '123-456-7890',
        nid: '987654321',
        apartment_id: 5,
        security_deposit: 2000,
        advance_payment: 1200,
        is_active: true,
        water_bill_enabled: true,
        gas_bill_enabled: true,
        electricity_bill_enabled: true,
        internet_bill_enabled: false,
        service_charge_enabled: true,
      };

      const createdTenant = {
        id: 5,
        ...createTenantDto,
      };

      mockTenantsService.create.mockResolvedValue(createdTenant);

      const result = await controller.create(createTenantDto);

      expect(result).toBe(createdTenant);
      expect(mockTenantsService.create).toHaveBeenCalledWith(createTenantDto);
    });

    it('should handle service errors during creation', async () => {
      const createTenantDto: CreateTenantDto = {
        name: 'New Tenant',
        phone_number: '123-456-7890',
        nid: '987654321',
        apartment_id: 999, // Non-existent apartment
        security_deposit: 2000,
        advance_payment: 1200,
        is_active: true,
        water_bill_enabled: true,
        gas_bill_enabled: true,
        electricity_bill_enabled: true,
        internet_bill_enabled: false,
        service_charge_enabled: true,
      };

      mockTenantsService.create.mockRejectedValue(
        new Error('Apartment not found'),
      );

      await expect(controller.create(createTenantDto)).rejects.toThrow();
      expect(mockTenantsService.create).toHaveBeenCalledWith(createTenantDto);
    });
  });

  describe('update', () => {
    it('should update an existing tenant', async () => {
      const tenantId = 1;
      const updateTenantDto: UpdateTenantDto = {
        name: 'Updated Name',
        phone_number: '987-654-3210',
      };

      const updatedTenant = {
        id: tenantId,
        name: 'Updated Name',
        phone_number: '987-654-3210',
        nid: '987654321',
      };

      mockTenantsService.update.mockResolvedValue(updatedTenant);

      const result = await controller.update(tenantId, updateTenantDto);

      expect(result).toBe(updatedTenant);
      expect(mockTenantsService.update).toHaveBeenCalledWith(
        tenantId,
        updateTenantDto,
      );
    });

    it('should throw an exception when tenant does not exist', async () => {
      const tenantId = 999;
      const updateTenantDto: UpdateTenantDto = {
        name: 'Updated Name',
      };

      mockTenantsService.update.mockResolvedValue(null);

      await expect(
        controller.update(tenantId, updateTenantDto),
      ).rejects.toThrow(HttpException);
      expect(mockTenantsService.update).toHaveBeenCalledWith(
        tenantId,
        updateTenantDto,
      );
    });
  });

  describe('archive', () => {
    it('should archive a tenant', async () => {
      const tenantId = 1;
      const archivedTenant = {
        id: tenantId,
        name: 'John Doe',
        is_active: false,
      };

      mockTenantsService.archive.mockResolvedValue(archivedTenant);

      const result = await controller.archive(tenantId);

      expect(result).toBe(archivedTenant);
      expect(mockTenantsService.archive).toHaveBeenCalledWith(tenantId);
    });

    it('should throw an exception when tenant does not exist', async () => {
      const tenantId = 999;
      mockTenantsService.archive.mockResolvedValue(null);

      await expect(controller.archive(tenantId)).rejects.toThrow(HttpException);
      expect(mockTenantsService.archive).toHaveBeenCalledWith(tenantId);
    });
  });

  describe('updateBillPreferences', () => {
    it('should update bill preferences for a tenant', async () => {
      const tenantId = 1;
      const billPreferencesDto: TenantBillPreferencesDto = {
        water_bill_enabled: true,
        gas_bill_enabled: false,
        electricity_bill_enabled: true,
        internet_bill_enabled: true,
        service_charge_enabled: true,
        trash_bill_enabled: false,
      };

      const updatedTenant = {
        id: tenantId,
        name: 'John Doe',
        ...billPreferencesDto,
      };

      mockTenantsService.updateBillPreferences.mockResolvedValue(updatedTenant);

      const result = await controller.updateBillPreferences(
        tenantId,
        billPreferencesDto,
      );

      expect(result).toBe(updatedTenant);
      expect(mockTenantsService.updateBillPreferences).toHaveBeenCalledWith(
        tenantId,
        billPreferencesDto,
      );
    });

    it('should throw an exception when tenant does not exist', async () => {
      const tenantId = 999;
      const billPreferencesDto: TenantBillPreferencesDto = {
        water_bill_enabled: true,
        gas_bill_enabled: false,
        electricity_bill_enabled: true,
        internet_bill_enabled: true,
        service_charge_enabled: true,
        trash_bill_enabled: false,
      };

      mockTenantsService.updateBillPreferences.mockResolvedValue(null);

      await expect(
        controller.updateBillPreferences(tenantId, billPreferencesDto),
      ).rejects.toThrow(HttpException);

      expect(mockTenantsService.updateBillPreferences).toHaveBeenCalledWith(
        tenantId,
        billPreferencesDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a tenant', async () => {
      const tenantId = 1;
      mockTenantsService.remove.mockResolvedValue(true);

      await controller.remove(tenantId);

      expect(mockTenantsService.remove).toHaveBeenCalledWith(tenantId);
    });

    it('should throw an exception when tenant does not exist', async () => {
      const tenantId = 999;
      mockTenantsService.remove.mockResolvedValue(false);

      await expect(controller.remove(tenantId)).rejects.toThrow(HttpException);
      expect(mockTenantsService.remove).toHaveBeenCalledWith(tenantId);
    });
  });

  describe('previewClosure', () => {
    it('should return closure preview calculations', async () => {
      const tenantId = 1;
      const previewDto: ClosurePreviewDto = {
        estimated_deductions: 300,
        deduction_reason: 'Minor repairs and cleaning',
      };

      const previewResult = {
        tenant_id: tenantId,
        tenant_name: 'John Doe',
        security_deposit: 2000,
        estimated_deductions: 300,
        deduction_reason: 'Minor repairs and cleaning',
        advance_payment: 500,
        outstanding_balance: 1000,
        final_balance_due: 500,
        potential_refund: 1700,
        preview_date: expect.any(Date),
        is_preview: true,
      };

      mockTenantsService.previewClosure.mockResolvedValue(previewResult);

      const result = await controller.previewClosure(tenantId, previewDto);

      expect(result).toBe(previewResult);
      expect(mockTenantsService.previewClosure).toHaveBeenCalledWith(
        tenantId,
        previewDto,
      );
    });

    it('should handle service errors during preview calculation', async () => {
      const tenantId = 999;
      const previewDto: ClosurePreviewDto = {
        estimated_deductions: 300,
        deduction_reason: 'Minor repairs and cleaning',
      };

      mockTenantsService.previewClosure.mockRejectedValue(
        new Error('Tenant not found'),
      );

      await expect(
        controller.previewClosure(tenantId, previewDto),
      ).rejects.toThrow(HttpException);
      expect(mockTenantsService.previewClosure).toHaveBeenCalledWith(
        tenantId,
        previewDto,
      );
    });
  });

  describe('processTenantClosure', () => {
    it('should process tenant closure and return settlement details', async () => {
      const tenantId = 1;
      const closureDto: TenantClosureDto = {
        deposit_deductions: 300,
        deduction_reason: 'Minor repairs and cleaning',
      };

      const closureResult = {
        tenant_id: tenantId,
        tenant_name: 'John Doe',
        security_deposit: 2000,
        deposit_deductions: 300,
        deduction_reason: 'Minor repairs and cleaning',
        advance_payment: 500,
        outstanding_balance: 1000,
        final_balance_due: 500,
        refund_amount: 1700,
        closure_date: expect.any(Date),
        is_preview: false,
      };

      mockTenantsService.processTenantClosure.mockResolvedValue(closureResult);

      const result = await controller.processTenantClosure(
        tenantId,
        closureDto,
      );

      expect(result).toBe(closureResult);
      expect(mockTenantsService.processTenantClosure).toHaveBeenCalledWith(
        tenantId,
        closureDto,
      );
    });

    it('should handle service errors during tenant closure', async () => {
      const tenantId = 999;
      const closureDto: TenantClosureDto = {
        deposit_deductions: 300,
        deduction_reason: 'Minor repairs and cleaning',
      };

      mockTenantsService.processTenantClosure.mockRejectedValue(
        new Error('Tenant not found'),
      );

      await expect(
        controller.processTenantClosure(tenantId, closureDto),
      ).rejects.toThrow(HttpException);
      expect(mockTenantsService.processTenantClosure).toHaveBeenCalledWith(
        tenantId,
        closureDto,
      );
    });
  });
});
