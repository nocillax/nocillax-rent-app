import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('root', () => {
    it('should return API information object', () => {
      const expectedInfo = {
        application: 'Rent Management System API',
        version: '1.0.0',
        description:
          'API for managing apartments, tenants, bills, and payments',
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
      expect(appController.getHello()).toEqual(expectedInfo);
    });
  });
});
