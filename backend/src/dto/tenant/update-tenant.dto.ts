import { PartialType } from '@nestjs/swagger';
import { CreateTenantDto } from './create-tenant.dto';

/**
 * DTO for updating tenant information
 * Extends CreateTenantDto making all properties optional
 */
export class UpdateTenantDto extends PartialType(CreateTenantDto) {}
