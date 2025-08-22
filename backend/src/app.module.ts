import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApartmentsModule } from './apartments/apartments.module';
import { TenantsModule } from './tenants/tenants.module';
import { BillsModule } from './bills/bills.module';
import { PaymentsModule } from './payments/payments.module';
import { ReportsModule } from './reports/reports.module';
import { Apartment } from './entities/apartment.entity';
import { Tenant } from './entities/tenant.entity';
import { Bill } from './entities/bill.entity';
import { Payment } from './entities/payment.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'password',
      database: 'rent_app',
      entities: [Apartment, Tenant, Bill, Payment],
      synchronize: true, // Set to false in production
    }),
    ApartmentsModule,
    TenantsModule,
    BillsModule,
    PaymentsModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
