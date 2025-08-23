import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Tenant } from './tenant.entity';
import { Apartment } from './apartment.entity';

@Entity('bills')
export class Bill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  month: number;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  rent: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  water_bill: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  gas_bill: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  electricity_bill: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  internet_bill: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  service_charge: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  other_charges: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total: number;

  @Column({ default: false })
  is_paid: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  last_edited_at: Date;

  // ManyToOne relationship with Tenant
  @ManyToOne(() => Tenant, (tenant) => tenant.bills)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column()
  tenant_id: number;
  
  // ManyToOne relationship with Apartment
  // This provides a direct relationship to Apartment
  @ManyToOne(() => Apartment)
  @JoinColumn({ name: 'apartment_id' })
  apartment: Apartment;
  
  @Column()
  apartment_id: number;
}
