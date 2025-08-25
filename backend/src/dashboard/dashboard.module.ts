import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { BillsModule } from '../bills/bills.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [BillsModule, PaymentsModule],
  controllers: [DashboardController],
})
export class DashboardModule {}
