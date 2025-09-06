import { validate, IsNumber, IsDateString } from 'class-validator';
import { plainToClass } from 'class-transformer';

// Create a mock TenantStatementDto with validation decorators
class TenantStatementDto {
  @IsNumber()
  tenantId: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}

describe('TenantStatementDto', () => {
  it('should validate with all required properties', async () => {
    const dto = new TenantStatementDto();
    dto.tenantId = 1;
    dto.startDate = '2025-01-01';
    dto.endDate = '2025-06-30';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation without tenantId', async () => {
    const dto = new TenantStatementDto();
    dto.startDate = '2025-01-01';
    dto.endDate = '2025-06-30';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('tenantId');
  });

  it('should fail validation without startDate', async () => {
    const dto = new TenantStatementDto();
    dto.tenantId = 1;
    dto.endDate = '2025-06-30';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('startDate');
  });

  it('should fail validation without endDate', async () => {
    const dto = new TenantStatementDto();
    dto.tenantId = 1;
    dto.startDate = '2025-01-01';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('endDate');
  });

  it('should fail validation with invalid date format', async () => {
    const dto = new TenantStatementDto();
    dto.tenantId = 1;
    dto.startDate = 'invalid-date';
    dto.endDate = '2025-06-30';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('startDate');
  });

  it('should fail validation with invalid tenant ID', async () => {
    const dto = new TenantStatementDto();
    dto.tenantId = 'not-a-number' as any;
    dto.startDate = '2025-01-01';
    dto.endDate = '2025-06-30';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('tenantId');
  });
});
