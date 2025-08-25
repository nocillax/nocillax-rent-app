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
import { ApiProperty } from '@nestjs/swagger';

@Entity('tenants')
export class Tenant {
  @ApiProperty({ description: 'Unique identifier for the tenant', example: 42 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Full name of the tenant',
    example: 'John Smith',
  })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({
    description: 'Contact phone number',
    example: '+1234567890',
    nullable: true,
  })
  @Column({ length: 20, nullable: true })
  phone_number: string;

  @ApiProperty({
    description: 'National identification number',
    example: 'AB1234567',
    nullable: true,
  })
  @Column({ length: 50, nullable: true })
  nid: string; // National ID

  @ApiProperty({
    description: "URL to tenant's photo",
    example: 'https://example.com/photos/tenant42.jpg',
    nullable: true,
  })
  @Column({ nullable: true })
  photo_url: string;

  @ApiProperty({
    description: 'Utility meter identification number',
    example: 'M54321',
    nullable: true,
  })
  @Column({ length: 50, nullable: true })
  meter_number: string;

  @ApiProperty({
    description: 'Whether the tenant is currently active',
    example: true,
  })
  @Column({ default: true })
  is_active: boolean;

  @ApiProperty({
    description:
      'Amount of advance payment on account (overpaid amount that carries over to future bills)',
    example: 500.0,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  advance_payment: number;

  @ApiProperty({
    description:
      'Security deposit amount paid at the start of tenancy (refundable at end of tenure)',
    example: 2000.0,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  security_deposit: number;

  @ApiProperty({
    description: 'Whether water bills are enabled for this tenant',
    example: true,
  })
  @Column({ type: 'boolean', default: true })
  water_bill_enabled: boolean;

  @ApiProperty({
    description: 'Whether gas bills are enabled for this tenant',
    example: true,
  })
  @Column({ type: 'boolean', default: true })
  gas_bill_enabled: boolean;

  @ApiProperty({
    description: 'Whether electricity bills are enabled for this tenant',
    example: true,
  })
  @Column({ type: 'boolean', default: true })
  electricity_bill_enabled: boolean;

  @ApiProperty({
    description: 'Whether internet bills are enabled for this tenant',
    example: false,
  })
  @Column({ type: 'boolean', default: true })
  internet_bill_enabled: boolean;

  @ApiProperty({
    description: 'Whether service charges are enabled for this tenant',
    example: true,
  })
  @Column({ type: 'boolean', default: true })
  service_charge_enabled: boolean;

  @ApiProperty({
    description: 'Whether trash bills are enabled for this tenant',
    example: true,
  })
  @Column({ type: 'boolean', default: true })
  trash_bill_enabled: boolean;

  @ApiProperty({
    description: 'Date the tenant was created',
    example: '2025-01-15T00:00:00.000Z',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ApiProperty({
    description: 'Date the tenant was last updated',
    example: '2025-08-01T00:00:00.000Z',
  })
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  // ManyToOne relationship with Apartment
  @ApiProperty({
    description: 'The apartment associated with this tenant',
    type: () => Apartment,
  })
  @ManyToOne(() => Apartment, (apartment) => apartment.tenants)
  @JoinColumn({ name: 'apartment_id' })
  apartment: Apartment;

  @ApiProperty({ description: 'ID of the apartment', example: 15 })
  @Column()
  apartment_id: number;

  // OneToMany relationship with Bill
  @ApiProperty({
    description: 'Bills associated with this tenant',
    type: [Bill],
  })
  @OneToMany(() => Bill, (bill) => bill.tenant)
  bills: Bill[];

  // OneToMany relationship with Payment
  @ApiProperty({ description: 'Payments made by this tenant', type: [Payment] })
  @OneToMany(() => Payment, (payment) => payment.tenant)
  payments: Payment[];
}
