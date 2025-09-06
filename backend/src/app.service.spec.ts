import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return API information object', () => {
    const expectedInfo = {
      application: 'Rent Management System API',
      version: '1.0.0',
      description: 'API for managing apartments, tenants, bills, and payments',
      endpoints: {
        api: '/api',
        documentation: '/api-docs',
        auth: '/auth',
        apartments: '/apartments',
        tenants: '/tenants',
        bills: '/bills',
        payments: '/payments',
        reports: '/reports',
        dashboard: '/dashboard',
      },
    };
    expect(service.getHello()).toEqual(expectedInfo);
  });
});
