import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from '../dto/payment/create-payment.dto';
import { UpdatePaymentDto } from '../dto/payment/update-payment.dto';

describe('PaymentsController', () => {
  let controller: PaymentsController;
  let service: PaymentsService;

  const mockPaymentsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getTotalPaymentsByTenantId: jest.fn(),
    getTenantPaymentHistory: jest.fn(),
    getMonthlyPaymentSummary: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        {
          provide: PaymentsService,
          useValue: mockPaymentsService,
        },
      ],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
    service = module.get<PaymentsService>(PaymentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all payments when no filters are provided', async () => {
      const expectedPayments = [
        { id: 1, amount: 500, tenant_id: 1 },
        { id: 2, amount: 700, tenant_id: 2 },
      ];
      mockPaymentsService.findAll.mockResolvedValue(expectedPayments);

      const result = await controller.findAll();

      expect(result).toBe(expectedPayments);
      expect(mockPaymentsService.findAll).toHaveBeenCalledWith(
        undefined,
        undefined,
        undefined,
      );
    });

    it('should filter payments by tenant ID when provided', async () => {
      const tenantId = 1;
      const expectedPayments = [
        { id: 1, amount: 500, tenant_id: tenantId },
        { id: 3, amount: 600, tenant_id: tenantId },
      ];
      mockPaymentsService.findAll.mockResolvedValue(expectedPayments);

      const result = await controller.findAll(tenantId);

      expect(result).toBe(expectedPayments);
      expect(mockPaymentsService.findAll).toHaveBeenCalledWith(
        tenantId,
        undefined,
        undefined,
      );
    });

    it('should filter payments by date range when provided', async () => {
      const startDate = '2025-01-01';
      const endDate = '2025-01-31';
      const expectedPayments = [
        { id: 1, amount: 500 },
        { id: 2, amount: 700 },
      ];
      mockPaymentsService.findAll.mockResolvedValue(expectedPayments);

      const result = await controller.findAll(undefined, startDate, endDate);

      expect(result).toBe(expectedPayments);
      expect(mockPaymentsService.findAll).toHaveBeenCalledWith(
        undefined,
        new Date(startDate),
        new Date(endDate),
      );
    });

    it('should convert date strings to Date objects', async () => {
      const tenantId = 1;
      const startDate = '2025-01-01';
      const endDate = '2025-01-31';

      await controller.findAll(tenantId, startDate, endDate);

      expect(mockPaymentsService.findAll).toHaveBeenCalledWith(
        tenantId,
        new Date(startDate),
        new Date(endDate),
      );
    });
  });

  describe('findOne', () => {
    it('should return a payment when it exists', async () => {
      const paymentId = 1;
      const expectedPayment = { id: paymentId, amount: 500, tenant_id: 1 };
      mockPaymentsService.findOne.mockResolvedValue(expectedPayment);

      const result = await controller.findOne(paymentId);

      expect(result).toBe(expectedPayment);
      expect(mockPaymentsService.findOne).toHaveBeenCalledWith(paymentId);
    });

    it('should throw an exception when payment does not exist', async () => {
      const paymentId = 999;
      mockPaymentsService.findOne.mockResolvedValue(null);

      await expect(controller.findOne(paymentId)).rejects.toThrow(
        HttpException,
      );
      expect(mockPaymentsService.findOne).toHaveBeenCalledWith(paymentId);
    });
  });

  describe('getTotalPaymentsByTenant', () => {
    it('should return total payments for a tenant', async () => {
      const tenantId = 1;
      const totalPayments = 2500;
      mockPaymentsService.getTotalPaymentsByTenantId.mockResolvedValue(
        totalPayments,
      );

      const result = await controller.getTotalPaymentsByTenant(tenantId);

      expect(result).toEqual({ total: totalPayments });
      expect(
        mockPaymentsService.getTotalPaymentsByTenantId,
      ).toHaveBeenCalledWith(tenantId);
    });
  });

  describe('getTenantPaymentHistory', () => {
    it('should return payment history for a tenant', async () => {
      const tenantId = 1;
      const paymentHistory = [
        {
          payment_id: 1,
          date: new Date('2025-08-01'),
          amount: 500,
          remaining_balance: 700,
        },
        {
          payment_id: 2,
          date: new Date('2025-09-01'),
          amount: 700,
          remaining_balance: 0,
        },
      ];
      mockPaymentsService.getTenantPaymentHistory.mockResolvedValue(
        paymentHistory,
      );

      const result = await controller.getTenantPaymentHistory(tenantId);

      expect(result).toBe(paymentHistory);
      expect(mockPaymentsService.getTenantPaymentHistory).toHaveBeenCalledWith(
        tenantId,
      );
    });
  });

  describe('getMonthlyPaymentSummary', () => {
    it('should return monthly payment summary', async () => {
      const year = 2025;
      const month = 8;
      const paymentSummary = [
        { tenantId: 1, tenant_name: 'John Doe', totalAmount: '1200.00' },
        { tenantId: 2, tenant_name: 'Jane Smith', totalAmount: '950.00' },
      ];
      mockPaymentsService.getMonthlyPaymentSummary.mockResolvedValue(
        paymentSummary,
      );

      const result = await controller.getMonthlyPaymentSummary(year, month);

      expect(result).toBe(paymentSummary);
      expect(mockPaymentsService.getMonthlyPaymentSummary).toHaveBeenCalledWith(
        year,
        month,
      );
    });

    it('should throw an exception when year and month are not provided', async () => {
      try {
        await controller.getMonthlyPaymentSummary(
          undefined as unknown as number,
          undefined as unknown as number,
        );
        fail('Expected HttpException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(
          mockPaymentsService.getMonthlyPaymentSummary,
        ).not.toHaveBeenCalled();
      }
    });
  });

  describe('create', () => {
    it('should create a new payment', async () => {
      const createPaymentDto: CreatePaymentDto = {
        amount: 500,
        tenant_id: 1,
        payment_method: 'Cash',
        description: 'Rent payment',
      };

      const createdPayment = {
        id: 1,
        ...createPaymentDto,
        date: new Date(),
        remaining_balance: 700,
      };

      mockPaymentsService.create.mockResolvedValue(createdPayment);

      const result = await controller.create(createPaymentDto);

      expect(result).toBe(createdPayment);
      expect(mockPaymentsService.create).toHaveBeenCalledWith(createPaymentDto);
    });

    it('should handle errors from the service', async () => {
      const createPaymentDto: CreatePaymentDto = {
        amount: 500,
        tenant_id: 999, // Non-existent tenant
        payment_method: 'Cash',
      };

      mockPaymentsService.create.mockRejectedValue(
        new Error('Tenant not found'),
      );

      await expect(controller.create(createPaymentDto)).rejects.toThrow();
      expect(mockPaymentsService.create).toHaveBeenCalledWith(createPaymentDto);
    });
  });

  describe('update', () => {
    it('should update an existing payment', async () => {
      const paymentId = 1;
      const updatePaymentDto: UpdatePaymentDto = {
        amount: 600,
        payment_method: 'Credit Card',
      };

      const updatedPayment = {
        id: paymentId,
        amount: 600,
        tenant_id: 1,
        payment_method: 'Credit Card',
      };

      mockPaymentsService.update.mockResolvedValue(updatedPayment);

      const result = await controller.update(paymentId, updatePaymentDto);

      expect(result).toBe(updatedPayment);
      expect(mockPaymentsService.update).toHaveBeenCalledWith(
        paymentId,
        updatePaymentDto,
      );
    });

    it('should throw an exception when payment does not exist', async () => {
      const paymentId = 999;
      const updatePaymentDto: UpdatePaymentDto = {
        amount: 600,
      };

      mockPaymentsService.update.mockResolvedValue(null);

      await expect(
        controller.update(paymentId, updatePaymentDto),
      ).rejects.toThrow(HttpException);
      expect(mockPaymentsService.update).toHaveBeenCalledWith(
        paymentId,
        updatePaymentDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a payment', async () => {
      const paymentId = 1;
      mockPaymentsService.remove.mockResolvedValue(true);

      await controller.remove(paymentId);

      expect(mockPaymentsService.remove).toHaveBeenCalledWith(paymentId);
    });

    it('should throw an exception when payment does not exist', async () => {
      const paymentId = 999;
      mockPaymentsService.remove.mockResolvedValue(false);

      await expect(controller.remove(paymentId)).rejects.toThrow(HttpException);
      expect(mockPaymentsService.remove).toHaveBeenCalledWith(paymentId);
    });
  });
});
