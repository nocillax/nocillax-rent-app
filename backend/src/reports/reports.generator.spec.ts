import { Test, TestingModule } from '@nestjs/testing';
import { ReportsGenerator } from './reports.generator';
import PDFDocument from 'pdfkit';
import { Bill } from '../entities/bill.entity';
import { Payment } from '../entities/payment.entity';
import { Tenant } from '../entities/tenant.entity';

// Mock PDFDocument
jest.mock('pdfkit', () => {
  return jest.fn().mockImplementation(() => {
    return {
      on: jest.fn().mockImplementation((event, callback) => {
        if (event === 'data') {
          // Call the callback with a mock buffer chunk
          callback(Buffer.from('test'));
        }
        return this;
      }),
      end: jest.fn().mockImplementation(function () {
        // Simulate end event after a small delay
        setTimeout(() => {
          const endCallback = this.on.mock.calls.find(
            (call) => call[0] === 'end',
          )[1];
          if (endCallback) endCallback();
        }, 10);
      }),
      fontSize: jest.fn().mockReturnThis(),
      text: jest.fn().mockReturnThis(),
      moveDown: jest.fn().mockReturnThis(),
      addPage: jest.fn().mockReturnThis(),
      page: { height: 1000 },
      y: 0,
    };
  });
});

describe('ReportsGenerator', () => {
  let generator: ReportsGenerator;
  let mockPdfDocument;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportsGenerator],
    }).compile();

    generator = module.get<ReportsGenerator>(ReportsGenerator);

    // Reset mocks and get a fresh instance of the mock
    jest.clearAllMocks();
    mockPdfDocument = new (jest.requireMock('pdfkit'))();
  });

  it('should be defined', () => {
    expect(generator).toBeDefined();
  });

  describe('generateMonthlyPdfReport', () => {
    it('should generate a monthly PDF report', async () => {
      const year = 2023;
      const month = 5;
      const mockBills = [
        {
          id: 1,
          year,
          month,
          tenant_id: 1,
          tenant: { name: 'Test Tenant 1' },
          rent: 1000,
          water_bill: 50,
          gas_bill: 30,
          electricity_bill: 70,
          internet_bill: 40,
          service_charge: 100,
          trash_bill: 20,
          other_charges: 0,
          total: 1310,
          is_paid: true,
        },
      ] as Bill[];

      const mockPayments = [
        {
          id: 1,
          tenant_id: 1,
          tenant: { name: 'Test Tenant 1' },
          date: new Date(2023, 4, 15),
          amount: 1310,
          payment_method: 'Credit Card',
          reference_number: 'REF123',
        },
      ] as unknown as Payment[];

      const pdfBuffer = await generator.generateMonthlyPdfReport(
        mockBills,
        mockPayments,
        year,
        month,
      );

      expect(PDFDocument).toHaveBeenCalled();
      expect(mockPdfDocument.fontSize).toHaveBeenCalled();
      expect(mockPdfDocument.text).toHaveBeenCalled();
      expect(mockPdfDocument.on).toHaveBeenCalledWith(
        'data',
        expect.any(Function),
      );
      expect(mockPdfDocument.end).toHaveBeenCalled();
      expect(pdfBuffer).toBeInstanceOf(Buffer);
    });
  });

  describe('generateTenantStatementPdf', () => {
    it('should generate a tenant statement PDF', async () => {
      const mockTenant = {
        id: 1,
        name: 'Test Tenant',
        apartment_id: 1,
        apartment: { name: 'Test Apartment' },
      } as Tenant;

      const startDate = new Date(2023, 0, 1); // January 1, 2023
      const endDate = new Date(2023, 11, 31); // December 31, 2023

      const mockBills = [
        {
          id: 1,
          tenant_id: 1,
          year: 2023,
          month: 5,
          rent: 1000,
          water_bill: 50,
          gas_bill: 30,
          electricity_bill: 70,
          trash_bill: 20,
          internet_bill: 40,
          service_charge: 100,
          other_charges: 0,
          total: 1310,
          is_paid: true,
        },
      ] as Bill[];

      const mockPayments = [
        {
          id: 1,
          tenant_id: 1,
          date: new Date(2023, 4, 15),
          amount: 1310,
          payment_method: 'Credit Card',
          reference_number: 'REF123',
        },
      ] as unknown as Payment[];

      const pdfBuffer = await generator.generateTenantStatementPdf(
        mockTenant,
        mockBills,
        mockPayments,
        startDate,
        endDate,
      );

      expect(PDFDocument).toHaveBeenCalled();
      expect(mockPdfDocument.fontSize).toHaveBeenCalled();
      expect(mockPdfDocument.text).toHaveBeenCalled();
      expect(mockPdfDocument.on).toHaveBeenCalledWith(
        'data',
        expect.any(Function),
      );
      expect(mockPdfDocument.end).toHaveBeenCalled();
      expect(pdfBuffer).toBeInstanceOf(Buffer);
    });
  });

  // We don't need to test private methods directly, as they are tested indirectly
  // through the public methods that use them. If you wanted to test them directly,
  // you would need to make them public or use TypeScript's type assertion to access them.
});
