import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Bill } from './bill.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('other_charges')
export class OtherCharge {
  @ApiProperty({ description: 'Unique identifier for the charge', example: 42 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Name of the additional charge',
    example: 'Parking Fee',
  })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({ description: 'Amount of the charge', example: 50.0 })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({
    description: 'Additional details about the charge',
    example: 'Monthly parking space rental',
    nullable: true,
  })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({
    description: 'Date when the charge was created',
    example: '2025-08-15T00:00:00.000Z',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ApiProperty({
    description: 'Date when the charge was last updated',
    example: '2025-08-16T00:00:00.000Z',
  })
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @ApiProperty({
    type: () => Bill,
    description: 'The bill this charge belongs to',
  })
  @ManyToOne(() => Bill)
  @JoinColumn({ name: 'bill_id' })
  bill: Bill;

  @ApiProperty({ description: 'ID of the associated bill', example: 105 })
  @Column()
  bill_id: number;
}
