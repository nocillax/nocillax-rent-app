import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

describe('DashboardController', () => {
  let controller: DashboardController;
  let service: DashboardService;

  const mockDashboardService = {
    getFinancialSummary: jest.fn(),
    getTenantStatuses: jest.fn(),
    getYearlySummary: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        {
          provide: DashboardService,
          useValue: mockDashboardService,
        },
      ],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
    service = module.get<DashboardService>(DashboardService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getFinancialSummary', () => {
    it('should return financial summary from service', async () => {
      const year = 2023;
      const month = 5;
      const mockSummary = {
        year,
        month,
        totalExpected: 5000,
        totalCollected: 4000,
        outstanding: 1000,
        collectionRate: 80,
        tenantPaymentStatuses: [],
      };

      mockDashboardService.getFinancialSummary.mockResolvedValue(mockSummary);

      const result = await controller.getFinancialSummary(year, month);

      expect(service.getFinancialSummary).toHaveBeenCalledWith(year, month);
      expect(result).toEqual(mockSummary);
    });

    it('should use default values when not provided', async () => {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const mockSummary = {
        year: currentYear,
        month: currentMonth,
        totalExpected: 5000,
        totalCollected: 4000,
        outstanding: 1000,
        collectionRate: 80,
        tenantPaymentStatuses: [],
      };

      mockDashboardService.getFinancialSummary.mockResolvedValue(mockSummary);

      const result = await controller.getFinancialSummary();

      expect(service.getFinancialSummary).toHaveBeenCalledWith(
        currentYear,
        currentMonth,
      );
      expect(result).toEqual(mockSummary);
    });
  });

  describe('getTenantStatuses', () => {
    it('should return tenant statuses from service', async () => {
      const year = 2023;
      const month = 5;
      const mockStatuses = [
        {
          tenantId: 1,
          tenantName: 'Test Tenant',
          billAmount: 1000,
          paidAmount: 1000,
          remainingAmount: 0,
          status: 'Paid',
          daysSinceLastPayment: null,
        },
      ];

      mockDashboardService.getTenantStatuses.mockResolvedValue(mockStatuses);

      const result = await controller.getTenantStatuses(year, month);

      expect(service.getTenantStatuses).toHaveBeenCalledWith(year, month);
      expect(result).toEqual(mockStatuses);
    });

    it('should use default values when not provided', async () => {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const mockStatuses = [
        {
          tenantId: 1,
          tenantName: 'Test Tenant',
          billAmount: 1000,
          paidAmount: 500,
          remainingAmount: 500,
          status: 'Partial',
          daysSinceLastPayment: null,
        },
      ];

      mockDashboardService.getTenantStatuses.mockResolvedValue(mockStatuses);

      const result = await controller.getTenantStatuses();

      expect(service.getTenantStatuses).toHaveBeenCalledWith(
        currentYear,
        currentMonth,
      );
      expect(result).toEqual(mockStatuses);
    });
  });

  describe('getYearlySummary', () => {
    it('should return yearly summary from service', async () => {
      const year = 2023;
      const mockSummary = {
        year,
        months: [
          {
            month: 1,
            totalExpected: 5000,
            totalCollected: 4000,
            outstanding: 1000,
          },
          // ...other months
        ],
        yearTotalExpected: 60000,
        yearTotalCollected: 55000,
      };

      mockDashboardService.getYearlySummary.mockResolvedValue(mockSummary);

      const result = await controller.getYearlySummary(year);

      expect(service.getYearlySummary).toHaveBeenCalledWith(year);
      expect(result).toEqual(mockSummary);
    });

    it('should use default year when not provided', async () => {
      const currentYear = new Date().getFullYear();
      const mockSummary = {
        year: currentYear,
        months: [
          {
            month: 1,
            totalExpected: 5000,
            totalCollected: 4000,
            outstanding: 1000,
          },
          // ...other months
        ],
        yearTotalExpected: 60000,
        yearTotalCollected: 55000,
      };

      mockDashboardService.getYearlySummary.mockResolvedValue(mockSummary);

      const result = await controller.getYearlySummary();

      expect(service.getYearlySummary).toHaveBeenCalledWith(currentYear);
      expect(result).toEqual(mockSummary);
    });
  });
});
