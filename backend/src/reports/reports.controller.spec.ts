import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('ReportsController', () => {
  let controller: ReportsController;
  let service: ReportsService;

  const mockResponse = () => {
    const res: any = {};
    res.set = jest.fn().mockReturnValue(res);
    res.end = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockReportsService = {
    generateMonthlyPdfReport: jest.fn(),
    generateTenantStatement: jest.fn(),
    saveReportToFile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        {
          provide: ReportsService,
          useValue: mockReportsService,
        },
      ],
    }).compile();

    controller = module.get<ReportsController>(ReportsController);
    service = module.get<ReportsService>(ReportsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('generateMonthlyReport', () => {
    it('should successfully generate a monthly report', async () => {
      const year = 2023;
      const month = 5;
      const mockPdfBuffer = Buffer.from('pdf content');
      const response = mockResponse();

      mockReportsService.generateMonthlyPdfReport.mockResolvedValue(
        mockPdfBuffer,
      );

      await controller.generateMonthlyReport(year, month, response);

      expect(mockReportsService.generateMonthlyPdfReport).toHaveBeenCalledWith(
        year,
        month,
      );
      expect(response.set).toHaveBeenCalledWith({
        'Content-Type': 'application/pdf',
        'Content-Disposition': expect.stringContaining(
          'attachment; filename=monthly-report',
        ),
        'Content-Length': mockPdfBuffer.length,
      });
      expect(response.end).toHaveBeenCalledWith(mockPdfBuffer);
    });

    it('should throw an exception when monthly report generation fails', async () => {
      const year = 2023;
      const month = 5;
      const response = mockResponse();
      const error = new Error('Test error');

      mockReportsService.generateMonthlyPdfReport.mockRejectedValue(error);

      await expect(
        controller.generateMonthlyReport(year, month, response),
      ).rejects.toThrow(
        new HttpException(
          'Failed to generate monthly report: Test error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('generateMonthlyPdf', () => {
    it('should successfully generate a monthly PDF report', async () => {
      const year = 2023;
      const month = 5;
      const mockPdfBuffer = Buffer.from('pdf content');
      const response = mockResponse();

      mockReportsService.generateMonthlyPdfReport.mockResolvedValue(
        mockPdfBuffer,
      );

      await controller.generateMonthlyPdf(year, month, response);

      expect(mockReportsService.generateMonthlyPdfReport).toHaveBeenCalledWith(
        year,
        month,
      );
      expect(response.set).toHaveBeenCalledWith({
        'Content-Type': 'application/pdf',
        'Content-Disposition': expect.stringContaining(
          'attachment; filename=monthly-report',
        ),
        'Content-Length': mockPdfBuffer.length,
      });
      expect(response.end).toHaveBeenCalledWith(mockPdfBuffer);
    });

    it('should throw an exception when year and month are not provided', async () => {
      const response = mockResponse();

      await expect(
        controller.generateMonthlyPdf(undefined, undefined, response),
      ).rejects.toThrow(
        new HttpException(
          'Year and month are required',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should throw an exception when monthly PDF report generation fails', async () => {
      const year = 2023;
      const month = 5;
      const response = mockResponse();
      const error = new Error('Test error');

      mockReportsService.generateMonthlyPdfReport.mockRejectedValue(error);

      await expect(
        controller.generateMonthlyPdf(year, month, response),
      ).rejects.toThrow(
        new HttpException(
          'Failed to generate monthly PDF report: Test error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('generateTenantReport', () => {
    it('should successfully generate a tenant report', async () => {
      const tenantId = 1;
      const startDate = '2023-01-01';
      const endDate = '2023-12-31';
      const mockPdfBuffer = Buffer.from('pdf content');
      const response = mockResponse();

      mockReportsService.generateTenantStatement.mockResolvedValue(
        mockPdfBuffer,
      );

      await controller.generateTenantReport(
        tenantId,
        startDate,
        endDate,
        response,
      );

      expect(mockReportsService.generateTenantStatement).toHaveBeenCalledWith(
        tenantId,
        new Date(startDate),
        new Date(endDate),
      );
      expect(response.set).toHaveBeenCalledWith({
        'Content-Type': 'application/pdf',
        'Content-Disposition': expect.stringContaining(
          'attachment; filename=tenant-',
        ),
        'Content-Length': mockPdfBuffer.length,
      });
      expect(response.end).toHaveBeenCalledWith(mockPdfBuffer);
    });

    it('should throw an exception when start and end dates are not provided', async () => {
      const tenantId = 1;
      const response = mockResponse();

      await expect(
        controller.generateTenantReport(
          tenantId,
          undefined,
          undefined,
          response,
        ),
      ).rejects.toThrow(
        new HttpException(
          'Start date and end date are required',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should throw an exception when tenant report generation fails', async () => {
      const tenantId = 1;
      const startDate = '2023-01-01';
      const endDate = '2023-12-31';
      const response = mockResponse();
      const error = new Error('Test error');

      mockReportsService.generateTenantStatement.mockRejectedValue(error);

      await expect(
        controller.generateTenantReport(tenantId, startDate, endDate, response),
      ).rejects.toThrow(
        new HttpException(
          'Failed to generate tenant report: Test error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('generateTenantStatement', () => {
    it('should successfully generate a tenant statement', async () => {
      const tenantId = 1;
      const startDate = '2023-01-01';
      const endDate = '2023-12-31';
      const mockPdfBuffer = Buffer.from('pdf content');
      const response = mockResponse();

      mockReportsService.generateTenantStatement.mockResolvedValue(
        mockPdfBuffer,
      );

      await controller.generateTenantStatement(
        tenantId,
        startDate,
        endDate,
        response,
      );

      expect(mockReportsService.generateTenantStatement).toHaveBeenCalledWith(
        tenantId,
        new Date(startDate),
        new Date(endDate),
      );
      expect(response.set).toHaveBeenCalledWith({
        'Content-Type': 'application/pdf',
        'Content-Disposition': expect.stringContaining(
          'attachment; filename=tenant-',
        ),
        'Content-Length': mockPdfBuffer.length,
      });
      expect(response.end).toHaveBeenCalledWith(mockPdfBuffer);
    });

    it('should throw an exception when start and end dates are not provided', async () => {
      const tenantId = 1;
      const response = mockResponse();

      await expect(
        controller.generateTenantStatement(
          tenantId,
          undefined,
          undefined,
          response,
        ),
      ).rejects.toThrow(
        new HttpException(
          'Start date and end date are required',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should throw an exception when tenant statement generation fails', async () => {
      const tenantId = 1;
      const startDate = '2023-01-01';
      const endDate = '2023-12-31';
      const response = mockResponse();
      const error = new Error('Test error');

      mockReportsService.generateTenantStatement.mockRejectedValue(error);

      await expect(
        controller.generateTenantStatement(
          tenantId,
          startDate,
          endDate,
          response,
        ),
      ).rejects.toThrow(
        new HttpException(
          'Failed to generate tenant statement: Test error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
});
