import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { BillsModule } from '../bills/bills.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [BillsModule, PaymentsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
