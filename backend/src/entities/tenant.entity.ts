import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Apartment } from './apartment.entity';
import { Bill } from './bill.entity';
import { Payment } from './payment.entity';

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 20, nullable: true })
  phone_number: string;

  @Column({ length: 50, nullable: true })
  nid: string; // National ID

  @Column({ nullable: true })
  photo_url: string;

  @Column({ length: 50, nullable: true })
  meter_number: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  // ManyToOne relationship with Apartment
  @ManyToOne(() => Apartment, (apartment) => apartment.tenants)
  @JoinColumn({ name: 'apartment_id' })
  apartment: Apartment;

  @Column()
  apartment_id: number;

  // OneToMany relationship with Bill
  @OneToMany(() => Bill, (bill) => bill.tenant)
  bills: Bill[];

  // OneToMany relationship with Payment
  @OneToMany(() => Payment, (payment) => payment.tenant)
  payments: Payment[];
}
