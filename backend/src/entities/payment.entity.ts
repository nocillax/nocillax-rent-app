import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Tenant } from './tenant.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('payments')
export class Payment {
  @ApiProperty({
    description: 'Unique identifier for the payment',
    example: 42,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Amount paid', example: 750.5 })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({
    description: 'Date when the payment was made',
    example: '2025-05-15T10:30:00.000Z',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @ApiProperty({
    description: 'Additional information about the payment',
    example: 'May rent payment',
    nullable: true,
  })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({
    description: 'Method used for payment',
    example: 'Credit Card',
    nullable: true,
  })
  @Column({ length: 50, nullable: true })
  payment_method: string;

  @ApiProperty({
    description: 'Reference or transaction number',
    example: 'TRX123456789',
    nullable: true,
  })
  @Column({ length: 100, nullable: true })
  reference_number: string;

  @ApiProperty({
    description: 'Remaining balance after payment',
    example: 250.0,
    nullable: true,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  remaining_balance: number;

  @ApiProperty({
    description: 'Date when payment record was created',
    example: '2025-05-15T10:30:00.000Z',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ApiProperty({
    description: 'Date when payment record was last updated',
    example: '2025-05-16T14:45:00.000Z',
  })
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @ApiProperty({
    type: () => Tenant,
    description: 'Tenant who made the payment',
  })
  @ManyToOne(() => Tenant, (tenant) => tenant.payments)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @ApiProperty({
    description: 'ID of the tenant who made the payment',
    example: 15,
  })
  @Column()
  tenant_id: number;
}
