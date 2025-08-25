import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Tenant } from './tenant.entity';
import { Apartment } from './apartment.entity';
import { OtherCharge } from './other-charge.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('bills')
export class Bill {
  @ApiProperty({ description: 'Unique identifier for the bill', example: 42 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Month number (1-12)', example: 8 })
  @Column({ type: 'int' })
  month: number;

  @ApiProperty({ description: 'Year', example: 2025 })
  @Column({ type: 'int' })
  year: number;

  @ApiProperty({ description: 'Previous unpaid balance', example: 150.5 })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  previous_balance: number;

  @ApiProperty({
    description: 'Advance payment applied to this bill',
    example: 200,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  advance_payment: number;

  @ApiProperty({ description: 'Due date for payment', example: '2025-09-15' })
  @Column({ type: 'date', nullable: true })
  due_date: Date;

  @ApiProperty({ description: 'Base rent amount', example: 1500 })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  rent: number;

  @ApiProperty({ description: 'Water bill amount', example: 45.75 })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  water_bill: number;

  @ApiProperty({ description: 'Gas bill amount', example: 35.5 })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  gas_bill: number;

  @ApiProperty({ description: 'Electricity bill amount', example: 85.25 })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  electricity_bill: number;

  @ApiProperty({ description: 'Internet bill amount', example: 60 })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  internet_bill: number;

  @ApiProperty({ description: 'Building service charge amount', example: 100 })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  service_charge: number;

  @ApiProperty({ description: 'Trash collection bill amount', example: 25 })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  trash_bill: number;

  @ApiProperty({ description: 'Additional charges amount', example: 75.5 })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  other_charges: number;

  @ApiProperty({ description: 'Total bill amount', example: 2100.75 })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total: number;

  @ApiProperty({
    description: 'Whether the bill has been paid',
    example: false,
  })
  @Column({ default: false })
  is_paid: boolean;

  @ApiProperty({
    description: 'Date the bill was created',
    example: '2025-08-01T00:00:00.000Z',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ApiProperty({
    description: 'Date the bill was last edited',
    example: '2025-08-15T00:00:00.000Z',
  })
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  last_edited_at: Date;

  // ManyToOne relationship with Tenant
  @ApiProperty({
    description: 'The tenant associated with this bill',
    type: () => Tenant,
  })
  @ManyToOne(() => Tenant, (tenant) => tenant.bills)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @ApiProperty({ description: 'ID of the tenant', example: 42 })
  @Column()
  tenant_id: number;

  // ManyToOne relationship with Apartment
  // This provides a direct relationship to Apartment
  @ApiProperty({
    description: 'The apartment associated with this bill',
    type: () => Apartment,
  })
  @ManyToOne(() => Apartment)
  @JoinColumn({ name: 'apartment_id' })
  apartment: Apartment;

  @ApiProperty({ description: 'ID of the apartment', example: 15 })
  @Column()
  apartment_id: number;

  // OneToMany relationship with OtherCharge
  @ApiProperty({
    description: 'List of additional charge items',
    type: [OtherCharge],
  })
  @OneToMany(() => OtherCharge, (otherCharge) => otherCharge.bill, {
    cascade: true,
  })
  other_charge_items: OtherCharge[];
}
