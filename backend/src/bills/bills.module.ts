import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillsController } from './bills.controller';
import { BillsService } from './bills.service';
import { Bill } from '../entities/bill.entity';
import { TenantsModule } from '../tenants/tenants.module';

@Module({
  imports: [TypeOrmModule.forFeature([Bill]), TenantsModule],
  controllers: [BillsController],
  providers: [BillsService],
  exports: [BillsService],
})
export class BillsModule {}
