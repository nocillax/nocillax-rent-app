import { PartialType } from '@nestjs/swagger';
import { CreatePaymentDto } from './create-payment.dto';

/**
 * DTO for updating payment information
 * Extends CreatePaymentDto making all properties optional
 */
export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {}
