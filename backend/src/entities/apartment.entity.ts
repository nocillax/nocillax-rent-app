import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Tenant } from './tenant.entity';
import { Bill } from './bill.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('apartments')
export class Apartment {
  @ApiProperty({
    description: 'Unique identifier for the apartment',
    example: 15,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Name of the apartment',
    example: 'Sunset Apartment 301',
  })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({
    description: 'Physical address of the apartment',
    example: '123 Main Street, Apt 301, Cityville',
  })
  @Column()
  address: string;

  @ApiProperty({
    description: 'Additional details about the apartment',
    example: 'Corner unit with balcony, 2 bed 2 bath',
    nullable: true,
  })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({
    description: 'Base monthly rent for the apartment',
    example: 1500.0,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  base_rent: number;

  @ApiProperty({
    description: 'Standard water bill amount for this apartment',
    example: 40.0,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  standard_water_bill: number;

  @ApiProperty({
    description: 'Standard electricity bill amount for this apartment',
    example: 65.0,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  standard_electricity_bill: number;

  @ApiProperty({
    description: 'Standard gas bill amount for this apartment',
    example: 30.0,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  standard_gas_bill: number;

  @ApiProperty({
    description: 'Standard internet bill amount for this apartment',
    example: 45.0,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  standard_internet_bill: number;

  @ApiProperty({
    description: 'Standard service charge amount for this apartment',
    example: 90.0,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  standard_service_charge: number;

  @ApiProperty({
    description: 'Standard trash bill amount for this apartment',
    example: 25.0,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  standard_trash_bill: number;

  @ApiProperty({
    description: 'Estimated total monthly rent including standard utilities',
    example: 1750.0,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  estimated_total_rent: number;

  @ApiProperty({
    description: 'Whether the apartment is currently active',
    example: true,
  })
  @Column({ default: true })
  is_active: boolean;

  @ApiProperty({
    description: 'Date the apartment was added',
    example: '2025-01-01T00:00:00.000Z',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ApiProperty({
    description: 'Date the apartment was last updated',
    example: '2025-06-15T00:00:00.000Z',
  })
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @ApiProperty({
    type: () => [Tenant],
    description: 'Tenants living in this apartment',
  })
  @OneToMany(() => Tenant, (tenant) => tenant.apartment)
  tenants: Tenant[];

  @ApiProperty({
    type: () => [Bill],
    description: 'Bills associated with this apartment',
  })
  @OneToMany(() => Bill, (bill) => bill.apartment)
  bills: Bill[];
}
