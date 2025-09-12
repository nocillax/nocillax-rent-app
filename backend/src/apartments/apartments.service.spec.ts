import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApartmentsService } from './apartments.service';
import { Apartment } from '../entities/apartment.entity';
import { Bill } from '../entities/bill.entity';
import { Tenant } from '../entities/tenant.entity';
import { CreateApartmentDto } from '../dto/apartment/create-apartment.dto';
import { UpdateApartmentDto } from '../dto/apartment/update-apartment.dto';
import { UpdateApartmentBillingDto } from '../dto/apartment/update-apartment-billing.dto';
import { NotFoundException } from '@nestjs/common';

describe('ApartmentsService', () => {
  let service: ApartmentsService;
  let apartmentRepository: Repository<Apartment>;
  let billRepository: Repository<Bill>;
  let tenantRepository: Repository<Tenant>;

  const mockApartmentRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockBillRepository = {
    find: jest.fn(),
  };

  const mockTenantRepository = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApartmentsService,
        {
          provide: getRepositoryToken(Apartment),
          useValue: mockApartmentRepository,
        },
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

    service = module.get<ApartmentsService>(ApartmentsService);
    apartmentRepository = module.get<Repository<Apartment>>(
      getRepositoryToken(Apartment),
    );
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

  describe('findAll', () => {
    it('should return an array of apartments with their tenants', async () => {
      const expectedApartments = [
        {
          id: 1,
          name: 'Apartment 101',
          address: '123 Main St',
          base_rent: 1200,
          tenants: [{ id: 1, name: 'John Doe' }],
        },
        {
          id: 2,
          name: 'Apartment 102',
          address: '456 Oak St',
          base_rent: 1500,
          tenants: [],
        },
      ];

      mockApartmentRepository.find.mockResolvedValue(expectedApartments);

      const result = await service.findAll();

      expect(result).toEqual(expectedApartments);
      expect(mockApartmentRepository.find).toHaveBeenCalledWith({
        relations: ['tenants'],
        order: { name: 'ASC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return an apartment by id with its tenants', async () => {
      const apartmentId = 1;
      const expectedApartment = {
        id: apartmentId,
        name: 'Apartment 101',
        address: '123 Main St',
        base_rent: 1200,
        tenants: [{ id: 1, name: 'John Doe' }],
      };

      mockApartmentRepository.findOne.mockResolvedValue(expectedApartment);

      const result = await service.findOne(apartmentId);

      expect(result).toEqual(expectedApartment);
      expect(mockApartmentRepository.findOne).toHaveBeenCalledWith({
        where: { id: apartmentId },
        relations: ['tenants'],
      });
    });

    it('should return null if apartment does not exist', async () => {
      const apartmentId = 999;

      mockApartmentRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne(apartmentId);

      expect(result).toBeNull();
      expect(mockApartmentRepository.findOne).toHaveBeenCalledWith({
        where: { id: apartmentId },
        relations: ['tenants'],
      });
    });
  });

  describe('findBillsForApartment', () => {
    it('should return bills for a specific apartment', async () => {
      const apartmentId = 1;
      const expectedBills = [
        {
          id: 1,
          apartment_id: apartmentId,
          tenant_id: 1,
          tenant: { id: 1, name: 'John Doe' },
          month: 8,
          year: 2025,
          amount: 1200,
        },
        {
          id: 2,
          apartment_id: apartmentId,
          tenant_id: 1,
          tenant: { id: 1, name: 'John Doe' },
          month: 7,
          year: 2025,
          amount: 1200,
        },
      ];

      mockBillRepository.find.mockResolvedValue(expectedBills);

      const result = await service.findBillsForApartment(apartmentId);

      expect(result).toEqual(expectedBills);
      expect(mockBillRepository.find).toHaveBeenCalledWith({
        where: { apartment_id: apartmentId },
        relations: ['tenant'],
        order: { year: 'DESC', month: 'DESC' },
      });
    });
  });

  describe('findTenantsForApartment', () => {
    it('should return active tenants for a specific apartment', async () => {
      const apartmentId = 1;
      const expectedTenants = [
        { id: 1, name: 'John Doe', is_active: true },
        { id: 2, name: 'Jane Smith', is_active: true },
      ];

      mockTenantRepository.find.mockResolvedValue(expectedTenants);

      const result = await service.findTenantsForApartment(apartmentId);

      expect(result).toEqual(expectedTenants);
      expect(mockTenantRepository.find).toHaveBeenCalledWith({
        where: { apartment_id: apartmentId, is_active: true },
        order: { name: 'ASC' },
      });
    });
  });

  describe('create', () => {
    it('should create a new apartment', async () => {
      const createApartmentDto: CreateApartmentDto = {
        name: 'New Apartment',
        address: '789 Pine St',
        size: 800,
        rooms: 2,
        rent_amount: 1300,
        description: 'Cozy apartment',
        is_available: true,
      };

      const createdApartment = {
        id: 3,
        ...createApartmentDto,
        base_rent: 1300, // Note: The entity field is base_rent while the DTO uses rent_amount
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
        tenants: [],
      };

      mockApartmentRepository.create.mockReturnValue(createdApartment);
      mockApartmentRepository.save.mockResolvedValue(createdApartment);

      const result = await service.create(createApartmentDto);

      expect(result).toEqual(createdApartment);
      expect(mockApartmentRepository.create).toHaveBeenCalledWith(
        createApartmentDto,
      );
      expect(mockApartmentRepository.save).toHaveBeenCalledWith(
        createdApartment,
      );
    });
  });

  describe('update', () => {
    it('should update an apartment', async () => {
      const apartmentId = 1;
      const updateApartmentDto: UpdateApartmentDto = {
        name: 'Updated Apartment',
        rent_amount: 1400,
      };

      const existingApartment = {
        id: apartmentId,
        name: 'Apartment 101',
        address: '123 Main St',
        base_rent: 1200,
      };

      const updatedApartment = {
        ...existingApartment,
        name: 'Updated Apartment',
        base_rent: 1400,
      };

      mockApartmentRepository.update.mockResolvedValue({ affected: 1 });
      mockApartmentRepository.findOne.mockResolvedValue(updatedApartment);

      const result = await service.update(apartmentId, updateApartmentDto);

      expect(result).toEqual(updatedApartment);
      expect(mockApartmentRepository.update).toHaveBeenCalledWith(
        apartmentId,
        updateApartmentDto,
      );
      expect(mockApartmentRepository.findOne).toHaveBeenCalledWith({
        where: { id: apartmentId },
        relations: ['tenants'],
      });
    });

    it('should return null if apartment does not exist', async () => {
      const apartmentId = 999;
      const updateApartmentDto: UpdateApartmentDto = {
        name: 'Updated Apartment',
      };

      mockApartmentRepository.update.mockResolvedValue({ affected: 0 });
      mockApartmentRepository.findOne.mockResolvedValue(null);

      const result = await service.update(apartmentId, updateApartmentDto);

      expect(result).toBeNull();
      expect(mockApartmentRepository.update).toHaveBeenCalledWith(
        apartmentId,
        updateApartmentDto,
      );
      expect(mockApartmentRepository.findOne).toHaveBeenCalledWith({
        where: { id: apartmentId },
        relations: ['tenants'],
      });
    });
  });

  describe('remove', () => {
    it('should remove an apartment', async () => {
      const apartmentId = 1;

      mockApartmentRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(apartmentId);

      expect(result).toBe(true);
      expect(mockApartmentRepository.delete).toHaveBeenCalledWith(apartmentId);
    });

    it('should return false if apartment does not exist', async () => {
      const apartmentId = 999;

      mockApartmentRepository.delete.mockResolvedValue({ affected: 0 });

      const result = await service.remove(apartmentId);

      expect(result).toBe(false);
      expect(mockApartmentRepository.delete).toHaveBeenCalledWith(apartmentId);
    });
  });

  describe('updateBillingStructure', () => {
    it('should update standard utility costs and estimated total rent', async () => {
      const apartmentId = 1;
      const updateBillingDto: UpdateApartmentBillingDto = {
        standardWaterBill: 45,
        standardElectricityBill: 70,
        standardGasBill: 35,
        standardInternetBill: 50,
        standardServiceCharge: 95,
        standardTrashBill: 30,
      };

      const existingApartment = {
        id: apartmentId,
        name: 'Apartment 101',
        base_rent: 1200,
        standard_water_bill: 40,
        standard_electricity_bill: 65,
        standard_gas_bill: 30,
        standard_internet_bill: 45,
        standard_service_charge: 90,
        standard_trash_bill: 25,
        estimated_total_rent: 1495, // 1200 + 40 + 65 + 30 + 45 + 90 + 25
      };

      const updatedApartment = {
        ...existingApartment,
        standard_water_bill: 45,
        standard_electricity_bill: 70,
        standard_gas_bill: 35,
        standard_internet_bill: 50,
        standard_service_charge: 95,
        standard_trash_bill: 30,
        estimated_total_rent: 1525, // 1200 + 45 + 70 + 35 + 50 + 95 + 30
      };

      mockApartmentRepository.findOne.mockResolvedValue(existingApartment);
      mockApartmentRepository.save.mockResolvedValue(updatedApartment);

      const result = await service.updateBillingStructure(
        apartmentId,
        updateBillingDto,
      );

      expect(result).toEqual(updatedApartment);
      expect(mockApartmentRepository.findOne).toHaveBeenCalledWith({
        where: { id: apartmentId },
      });
      expect(mockApartmentRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: apartmentId,
          standard_water_bill: 45,
          standard_electricity_bill: 70,
          standard_gas_bill: 35,
          standard_internet_bill: 50,
          standard_service_charge: 95,
          standard_trash_bill: 30,
          estimated_total_rent: 1525, // Sum of base_rent and all standard utility costs
        }),
      );
    });

    it('should update only the provided standard utility costs', async () => {
      const apartmentId = 1;
      const updateBillingDto: UpdateApartmentBillingDto = {
        standardWaterBill: 50, // Only updating water bill
      };

      const existingApartment = {
        id: apartmentId,
        name: 'Apartment 101',
        base_rent: 1200,
        standard_water_bill: 40,
        standard_electricity_bill: 65,
        standard_gas_bill: 30,
        standard_internet_bill: 45,
        standard_service_charge: 90,
        standard_trash_bill: 25,
        estimated_total_rent: 1495, // 1200 + 40 + 65 + 30 + 45 + 90 + 25
      };

      const updatedApartment = {
        ...existingApartment,
        standard_water_bill: 50, // Only water bill updated
        estimated_total_rent: 1505, // 1200 + 50 + 65 + 30 + 45 + 90 + 25
      };

      mockApartmentRepository.findOne.mockResolvedValue(existingApartment);
      mockApartmentRepository.save.mockResolvedValue(updatedApartment);

      const result = await service.updateBillingStructure(
        apartmentId,
        updateBillingDto,
      );

      expect(result).toEqual(updatedApartment);
      expect(mockApartmentRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: apartmentId,
          standard_water_bill: 50,
          standard_electricity_bill: 65, // Unchanged
          standard_gas_bill: 30, // Unchanged
          standard_internet_bill: 45, // Unchanged
          standard_service_charge: 90, // Unchanged
          standard_trash_bill: 25, // Unchanged
          estimated_total_rent: 1505, // Updated total
        }),
      );
    });

    it('should throw NotFoundException if apartment does not exist', async () => {
      const apartmentId = 999;
      const updateBillingDto: UpdateApartmentBillingDto = {
        standardWaterBill: 45,
      };

      mockApartmentRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateBillingStructure(apartmentId, updateBillingDto),
      ).rejects.toThrow(
        new NotFoundException(`Apartment with ID ${apartmentId} not found`),
      );

      expect(mockApartmentRepository.findOne).toHaveBeenCalledWith({
        where: { id: apartmentId },
      });
      expect(mockApartmentRepository.save).not.toHaveBeenCalled();
    });
  });
});
