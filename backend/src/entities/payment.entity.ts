import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Tenant } from './tenant.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column({ nullable: true })
  description: string;

  @Column({ length: 50, nullable: true })
  payment_method: string;

  @Column({ length: 100, nullable: true })
  reference_number: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  // ManyToOne relationship with Tenant
  @ManyToOne(() => Tenant, (tenant) => tenant.payments)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column()
  tenant_id: number;
}
