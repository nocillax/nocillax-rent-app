import { IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateApartmentBillingDto {
  @ApiProperty({ description: 'Standard water bill amount', example: 45 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  standardWaterBill?: number;

  @ApiProperty({ description: 'Standard electricity bill amount', example: 65 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  standardElectricityBill?: number;

  @ApiProperty({ description: 'Standard gas bill amount', example: 35 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  standardGasBill?: number;

  @ApiProperty({ description: 'Standard internet bill amount', example: 50 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  standardInternetBill?: number;

  @ApiProperty({ description: 'Standard service charge amount', example: 90 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  standardServiceCharge?: number;

  @ApiProperty({ description: 'Standard trash bill amount', example: 25 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  standardTrashBill?: number;
}
