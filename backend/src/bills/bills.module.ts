import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillsController } from './bills.controller';
import { BillsService } from './bills.service';
import { BillGenerationService } from './bill-generation.service';
import { Bill } from '../entities/bill.entity';
import { Tenant } from '../entities/tenant.entity';
import { OtherCharge } from '../entities/other-charge.entity';
import { TenantsModule } from '../tenants/tenants.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bill, Tenant, OtherCharge]),
    TenantsModule,
  ],
  controllers: [BillsController],
  providers: [BillsService, BillGenerationService],
  exports: [BillsService, BillGenerationService],
})
export class BillsModule {}
