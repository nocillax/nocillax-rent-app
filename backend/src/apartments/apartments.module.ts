import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApartmentsController } from './apartments.controller';
import { ApartmentsService } from './apartments.service';
import { Apartment } from '../entities/apartment.entity';
import { Bill } from '../entities/bill.entity';
import { Tenant } from '../entities/tenant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Apartment, Bill, Tenant])],
  controllers: [ApartmentsController],
  providers: [ApartmentsService],
  exports: [ApartmentsService],
})
export class ApartmentsModule {}
