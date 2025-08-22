import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Tenant } from './tenant.entity';

@Entity('apartments')
export class Apartment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  base_rent: number;

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

  // OneToMany relationship with Tenant
  @OneToMany(() => Tenant, (tenant) => tenant.apartment)
  tenants: Tenant[];
}
