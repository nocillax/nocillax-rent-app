import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { ReportsGenerator } from './reports.generator';
import { Bill } from '../entities/bill.entity';
import { Payment } from '../entities/payment.entity';
import { Tenant } from '../entities/tenant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bill, Payment, Tenant])],
  controllers: [ReportsController],
  providers: [ReportsService, ReportsGenerator],
  exports: [ReportsService],
})
export class ReportsModule {}
