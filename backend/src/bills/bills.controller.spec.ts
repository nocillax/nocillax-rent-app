import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { BillsController } from './bills.controller';
import { BillsService } from './bills.service';
import { BillGenerationService } from './bill-generation.service';
import { CreateBillDto } from '../dto/bill/create-bill.dto';
import { UpdateBillDto } from '../dto/bill/update-bill.dto';
import { OtherChargeDto } from '../dto/bill/other-charge.dto';

describe('BillsController', () => {
  let controller: BillsController;
  let billsService: BillsService;
  let billGenerationService: BillGenerationService;

  const mockBillsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    markAsPaid: jest.fn(),
    remove: jest.fn(),
    addOtherCharge: jest.fn(),
    removeOtherCharge: jest.fn(),
    calculateFinalBillForTenant: jest.fn(),
  };

  const mockBillGenerationService = {
    generateBillsForMonth: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BillsController],
      providers: [
        { provide: BillsService, useValue: mockBillsService },
        { provide: BillGenerationService, useValue: mockBillGenerationService },
      ],
    }).compile();

    controller = module.get<BillsController>(BillsController);
    billsService = module.get<BillsService>(BillsService);
    billGenerationService = module.get<BillGenerationService>(
      BillGenerationService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of bills', async () => {
      const expectedBills = [{ id: 1 }, { id: 2 }];
      mockBillsService.findAll.mockResolvedValue(expectedBills);

      const result = await controller.findAll();

      expect(result).toBe(expectedBills);
      expect(mockBillsService.findAll).toHaveBeenCalled();
    });

    it('should accept filtering parameters', async () => {
      const expectedBills = [{ id: 1 }];
      mockBillsService.findAll.mockResolvedValue(expectedBills);

      const result = await controller.findAll(1, 2025, 8);

      expect(result).toBe(expectedBills);
      expect(mockBillsService.findAll).toHaveBeenCalledWith(1, 2025, 8);
    });
  });

  describe('findOne', () => {
    it('should return a bill when it exists', async () => {
      const expectedBill = { id: 1 };
      mockBillsService.findOne.mockResolvedValue(expectedBill);

      const result = await controller.findOne(1);

      expect(result).toBe(expectedBill);
      expect(mockBillsService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw an exception when bill does not exist', async () => {
      mockBillsService.findOne.mockResolvedValue(null);

      await expect(controller.findOne(999)).rejects.toThrow(HttpException);
      expect(mockBillsService.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('create', () => {
    it('should create and return a new bill', async () => {
      const createBillDto: CreateBillDto = {
        tenant_id: 1,
        apartment_id: 1,
        year: 2025,
        month: 8,
        rent: 1200,
        water_bill: 50,
        gas_bill: 30,
        electricity_bill: 100,
        internet_bill: 40,
        service_charge: 80,
        trash_bill: 20,
        other_charges: 0,
        previous_balance: 0,
        advance_payment: 0,
        is_paid: false,
        due_date: '2025-08-10',
      };

      const createdBill = { id: 1, ...createBillDto };
      mockBillsService.create.mockResolvedValue(createdBill);

      const result = await controller.create(createBillDto);

      expect(result).toBe(createdBill);
      expect(mockBillsService.create).toHaveBeenCalledWith(createBillDto);
    });
  });

  describe('update', () => {
    it('should update and return the bill', async () => {
      const updateBillDto: UpdateBillDto = {
        water_bill: 55,
        electricity_bill: 110,
      };

      const updatedBill = {
        id: 1,
        tenant_id: 1,
        water_bill: 55,
        electricity_bill: 110,
      };

      mockBillsService.update.mockResolvedValue(updatedBill);

      const result = await controller.update(1, updateBillDto);

      expect(result).toBe(updatedBill);
      expect(mockBillsService.update).toHaveBeenCalledWith(1, updateBillDto);
    });

    it('should throw an exception when bill does not exist', async () => {
      const updateBillDto: UpdateBillDto = {
        water_bill: 55,
      };

      mockBillsService.update.mockResolvedValue(null);

      await expect(controller.update(999, updateBillDto)).rejects.toThrow(
        HttpException,
      );
      expect(mockBillsService.update).toHaveBeenCalledWith(999, updateBillDto);
    });
  });

  describe('markAsPaid', () => {
    it('should mark a bill as paid and return it', async () => {
      const paidBill = {
        id: 1,
        is_paid: true,
      };

      mockBillsService.markAsPaid.mockResolvedValue(paidBill);

      const result = await controller.markAsPaid(1);

      expect(result).toBe(paidBill);
      expect(mockBillsService.markAsPaid).toHaveBeenCalledWith(1);
    });

    it('should throw an exception when bill does not exist', async () => {
      mockBillsService.markAsPaid.mockResolvedValue(null);

      await expect(controller.markAsPaid(999)).rejects.toThrow(HttpException);
      expect(mockBillsService.markAsPaid).toHaveBeenCalledWith(999);
    });
  });

  describe('remove', () => {
    it('should remove a bill successfully', async () => {
      mockBillsService.remove.mockResolvedValue(true);

      await controller.remove(1);

      expect(mockBillsService.remove).toHaveBeenCalledWith(1);
    });

    it('should throw an exception when bill does not exist', async () => {
      mockBillsService.remove.mockResolvedValue(false);

      await expect(controller.remove(999)).rejects.toThrow(HttpException);
      expect(mockBillsService.remove).toHaveBeenCalledWith(999);
    });
  });

  describe('generateBills', () => {
    it('should generate bills for a specific month', async () => {
      const generatedBills = [{ id: 1 }, { id: 2 }];
      mockBillGenerationService.generateBillsForMonth.mockResolvedValue(
        generatedBills,
      );

      const result = await controller.generateBills(2025, 8);

      expect(result).toBe(generatedBills);
      expect(
        mockBillGenerationService.generateBillsForMonth,
      ).toHaveBeenCalledWith(2025, 8);
    });

    it('should throw an exception when year and month are not provided', async () => {
      await expect(controller.generateBills(null, null)).rejects.toThrow(
        HttpException,
      );
      expect(
        mockBillGenerationService.generateBillsForMonth,
      ).not.toHaveBeenCalled();
    });

    it('should handle errors from the service', async () => {
      mockBillGenerationService.generateBillsForMonth.mockRejectedValue(
        new Error('Failed to generate'),
      );

      await expect(controller.generateBills(2025, 8)).rejects.toThrow(
        HttpException,
      );
      expect(
        mockBillGenerationService.generateBillsForMonth,
      ).toHaveBeenCalledWith(2025, 8);
    });
  });

  describe('addOtherCharge', () => {
    it('should add a charge to a bill', async () => {
      const chargeDto: OtherChargeDto = {
        name: 'Repair',
        description: 'Repair cost',
        amount: 100,
      };

      const bill = { id: 1 };
      mockBillsService.findOne.mockResolvedValue(bill);

      const updatedBill = {
        id: 1,
        other_charges: 100,
        total: 1300,
      };
      mockBillsService.addOtherCharge.mockResolvedValue(updatedBill);

      const result = await controller.addOtherCharge(1, chargeDto);

      expect(result).toBe(updatedBill);
      expect(mockBillsService.findOne).toHaveBeenCalledWith(1);
      expect(mockBillsService.addOtherCharge).toHaveBeenCalledWith(
        1,
        chargeDto,
      );
    });

    it('should throw an exception when bill does not exist', async () => {
      const chargeDto: OtherChargeDto = {
        name: 'Repair',
        description: 'Repair cost',
        amount: 100,
      };

      mockBillsService.findOne.mockResolvedValue(null);

      await expect(controller.addOtherCharge(999, chargeDto)).rejects.toThrow(
        HttpException,
      );
      expect(mockBillsService.findOne).toHaveBeenCalledWith(999);
      expect(mockBillsService.addOtherCharge).not.toHaveBeenCalled();
    });
  });

  describe('removeOtherCharge', () => {
    it('should remove a charge from a bill', async () => {
      mockBillsService.removeOtherCharge.mockResolvedValue(true);

      await controller.removeOtherCharge(1, 5);

      expect(mockBillsService.removeOtherCharge).toHaveBeenCalledWith(1, 5);
    });

    it('should throw an exception when charge does not exist', async () => {
      mockBillsService.removeOtherCharge.mockResolvedValue(false);

      await expect(controller.removeOtherCharge(1, 999)).rejects.toThrow(
        HttpException,
      );
      expect(mockBillsService.removeOtherCharge).toHaveBeenCalledWith(1, 999);
    });
  });

  describe('calculateFinalBill', () => {
    it('should calculate final bill for a tenant', async () => {
      const finalBill = {
        current_month_bill: { id: 1 },
        total_outstanding: 1200,
        security_deposit: 2000,
      };
      mockBillsService.calculateFinalBillForTenant.mockResolvedValue(finalBill);

      const result = await controller.calculateFinalBill(1);

      expect(result).toBe(finalBill);
      expect(mockBillsService.calculateFinalBillForTenant).toHaveBeenCalledWith(
        1,
      );
    });

    it('should handle errors from the service', async () => {
      mockBillsService.calculateFinalBillForTenant.mockRejectedValue(
        new Error('Tenant not found'),
      );

      await expect(controller.calculateFinalBill(999)).rejects.toThrow(
        HttpException,
      );
      expect(mockBillsService.calculateFinalBillForTenant).toHaveBeenCalledWith(
        999,
      );
    });
  });
});
