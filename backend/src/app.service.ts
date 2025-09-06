import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): object {
    return {
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
  }
}
