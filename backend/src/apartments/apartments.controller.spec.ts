import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ApartmentsController } from './apartments.controller';
import { ApartmentsService } from './apartments.service';
import { CreateApartmentDto } from '../dto/apartment/create-apartment.dto';
import { UpdateApartmentDto } from '../dto/apartment/update-apartment.dto';
import { UpdateApartmentBillingDto } from '../dto/apartment/update-apartment-billing.dto';

describe('ApartmentsController', () => {
  let controller: ApartmentsController;
  let service: ApartmentsService;

  const mockApartmentsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findBillsForApartment: jest.fn(),
    findTenantsForApartment: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    updateBillingStructure: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApartmentsController],
      providers: [
        {
          provide: ApartmentsService,
          useValue: mockApartmentsService,
        },
      ],
    }).compile();

    controller = module.get<ApartmentsController>(ApartmentsController);
    service = module.get<ApartmentsService>(ApartmentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of apartments', async () => {
      const apartments = [
        {
          id: 1,
          name: 'Apartment 101',
          address: '123 Main St',
          base_rent: 1200,
        },
        {
          id: 2,
          name: 'Apartment 102',
          address: '456 Oak St',
          base_rent: 1500,
        },
      ];

      mockApartmentsService.findAll.mockResolvedValue(apartments);

      const result = await controller.findAll();

      expect(result).toEqual(apartments);
      expect(mockApartmentsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an apartment when it exists', async () => {
      const apartmentId = 1;
      const apartment = {
        id: apartmentId,
        name: 'Apartment 101',
        address: '123 Main St',
        base_rent: 1200,
      };

      mockApartmentsService.findOne.mockResolvedValue(apartment);

      const result = await controller.findOne(apartmentId);

      expect(result).toEqual(apartment);
      expect(mockApartmentsService.findOne).toHaveBeenCalledWith(apartmentId);
    });

    it('should throw HttpException when apartment does not exist', async () => {
      const apartmentId = 999;

      mockApartmentsService.findOne.mockResolvedValue(null);

      await expect(controller.findOne(apartmentId)).rejects.toThrow(
        new HttpException('Apartment not found', HttpStatus.NOT_FOUND),
      );
      expect(mockApartmentsService.findOne).toHaveBeenCalledWith(apartmentId);
    });
  });

  describe('findBills', () => {
    it('should return bills for an apartment', async () => {
      const apartmentId = 1;
      const apartment = {
        id: apartmentId,
        name: 'Apartment 101',
      };
      const bills = [
        {
          id: 1,
          apartment_id: apartmentId,
          month: 8,
          year: 2025,
        },
        {
          id: 2,
          apartment_id: apartmentId,
          month: 7,
          year: 2025,
        },
      ];

      mockApartmentsService.findOne.mockResolvedValue(apartment);
      mockApartmentsService.findBillsForApartment.mockResolvedValue(bills);

      const result = await controller.findBills(apartmentId);

      expect(result).toEqual(bills);
      expect(mockApartmentsService.findOne).toHaveBeenCalledWith(apartmentId);
      expect(mockApartmentsService.findBillsForApartment).toHaveBeenCalledWith(
        apartmentId,
      );
    });

    it('should throw HttpException when apartment does not exist', async () => {
      const apartmentId = 999;

      mockApartmentsService.findOne.mockResolvedValue(null);

      await expect(controller.findBills(apartmentId)).rejects.toThrow(
        new HttpException('Apartment not found', HttpStatus.NOT_FOUND),
      );
      expect(mockApartmentsService.findOne).toHaveBeenCalledWith(apartmentId);
      expect(
        mockApartmentsService.findBillsForApartment,
      ).not.toHaveBeenCalled();
    });
  });

  describe('findTenants', () => {
    it('should return tenants for an apartment', async () => {
      const apartmentId = 1;
      const apartment = {
        id: apartmentId,
        name: 'Apartment 101',
      };
      const tenants = [
        { id: 1, name: 'John Doe', apartment_id: apartmentId },
        { id: 2, name: 'Jane Smith', apartment_id: apartmentId },
      ];

      mockApartmentsService.findOne.mockResolvedValue(apartment);
      mockApartmentsService.findTenantsForApartment.mockResolvedValue(tenants);

      const result = await controller.findTenants(apartmentId);

      expect(result).toEqual(tenants);
      expect(mockApartmentsService.findOne).toHaveBeenCalledWith(apartmentId);
      expect(
        mockApartmentsService.findTenantsForApartment,
      ).toHaveBeenCalledWith(apartmentId);
    });

    it('should throw HttpException when apartment does not exist', async () => {
      const apartmentId = 999;

      mockApartmentsService.findOne.mockResolvedValue(null);

      await expect(controller.findTenants(apartmentId)).rejects.toThrow(
        new HttpException('Apartment not found', HttpStatus.NOT_FOUND),
      );
      expect(mockApartmentsService.findOne).toHaveBeenCalledWith(apartmentId);
      expect(
        mockApartmentsService.findTenantsForApartment,
      ).not.toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create and return a new apartment', async () => {
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
        name: 'New Apartment',
        address: '789 Pine St',
        base_rent: 1300,
        size: 800,
        rooms: 2,
        description: 'Cozy apartment',
        is_active: true,
      };

      mockApartmentsService.create.mockResolvedValue(createdApartment);

      const result = await controller.create(createApartmentDto);

      expect(result).toEqual(createdApartment);
      expect(mockApartmentsService.create).toHaveBeenCalledWith(
        createApartmentDto,
      );
    });
  });

  describe('update', () => {
    it('should update and return an apartment', async () => {
      const apartmentId = 1;
      const updateApartmentDto: UpdateApartmentDto = {
        name: 'Updated Apartment',
        rent_amount: 1400,
      };

      const updatedApartment = {
        id: apartmentId,
        name: 'Updated Apartment',
        address: '123 Main St',
        base_rent: 1400,
      };

      mockApartmentsService.update.mockResolvedValue(updatedApartment);

      const result = await controller.update(apartmentId, updateApartmentDto);

      expect(result).toEqual(updatedApartment);
      expect(mockApartmentsService.update).toHaveBeenCalledWith(
        apartmentId,
        updateApartmentDto,
      );
    });

    it('should throw HttpException when apartment does not exist', async () => {
      const apartmentId = 999;
      const updateApartmentDto: UpdateApartmentDto = {
        name: 'Updated Apartment',
      };

      mockApartmentsService.update.mockResolvedValue(null);

      await expect(
        controller.update(apartmentId, updateApartmentDto),
      ).rejects.toThrow(
        new HttpException('Apartment not found', HttpStatus.NOT_FOUND),
      );
      expect(mockApartmentsService.update).toHaveBeenCalledWith(
        apartmentId,
        updateApartmentDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove an apartment successfully', async () => {
      const apartmentId = 1;

      mockApartmentsService.remove.mockResolvedValue(true);

      await controller.remove(String(apartmentId));

      expect(mockApartmentsService.remove).toHaveBeenCalledWith(apartmentId);
    });

    it('should throw HttpException when apartment does not exist', async () => {
      const apartmentId = 999;

      mockApartmentsService.remove.mockResolvedValue(false);

      await expect(controller.remove(String(apartmentId))).rejects.toThrow(
        new HttpException('Apartment not found', HttpStatus.NOT_FOUND),
      );
      expect(mockApartmentsService.remove).toHaveBeenCalledWith(apartmentId);
    });
  });

  describe('updateBillingStructure', () => {
    it('should update and return apartment billing structure', async () => {
      const apartmentId = 1;
      const updateBillingDto: UpdateApartmentBillingDto = {
        standardWaterBill: 45,
        standardElectricityBill: 70,
        standardGasBill: 35,
        standardInternetBill: 50,
        standardServiceCharge: 95,
        standardTrashBill: 30,
      };

      const updatedApartment = {
        id: apartmentId,
        name: 'Apartment 101',
        base_rent: 1200,
        standard_water_bill: 45,
        standard_electricity_bill: 70,
        standard_gas_bill: 35,
        standard_internet_bill: 50,
        standard_service_charge: 95,
        standard_trash_bill: 30,
        estimated_total_rent: 1525,
      };

      mockApartmentsService.updateBillingStructure.mockResolvedValue(
        updatedApartment,
      );

      const result = await controller.updateBillingStructure(
        String(apartmentId),
        updateBillingDto,
      );

      expect(result).toEqual(updatedApartment);
      expect(mockApartmentsService.updateBillingStructure).toHaveBeenCalledWith(
        apartmentId,
        updateBillingDto,
      );
    });

    it('should throw HttpException when apartment does not exist', async () => {
      const apartmentId = 999;
      const updateBillingDto: UpdateApartmentBillingDto = {
        standardWaterBill: 45,
      };

      mockApartmentsService.updateBillingStructure.mockRejectedValue(
        new HttpException('Apartment not found', HttpStatus.NOT_FOUND),
      );

      await expect(
        controller.updateBillingStructure(
          String(apartmentId),
          updateBillingDto,
        ),
      ).rejects.toThrow(
        new HttpException('Apartment not found', HttpStatus.NOT_FOUND),
      );

      expect(mockApartmentsService.updateBillingStructure).toHaveBeenCalledWith(
        apartmentId,
        updateBillingDto,
      );
    });
  });
});
