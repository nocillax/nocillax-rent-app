import { validate, IsNumber, Min, Max } from 'class-validator';
import { plainToClass } from 'class-transformer';

// Create a mock MonthlyReportDto with validation decorators
class MonthlyReportDto {
  @IsNumber()
  @Min(2000)
  year: number;

  @IsNumber()
  @Min(1)
  @Max(12)
  month: number;
}

describe('MonthlyReportDto', () => {
  it('should validate with valid year and month', async () => {
    const dto = new MonthlyReportDto();
    dto.year = 2025;
    dto.month = 6;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation without year', async () => {
    const dto = new MonthlyReportDto();
    dto.month = 6;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('year');
  });

  it('should fail validation without month', async () => {
    const dto = new MonthlyReportDto();
    dto.year = 2025;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('month');
  });

  it('should fail validation with year less than 2000', async () => {
    const dto = new MonthlyReportDto();
    dto.year = 1999;
    dto.month = 6;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('year');
    expect(errors[0].constraints).toHaveProperty('min');
  });

  it('should fail validation with month less than 1', async () => {
    const dto = new MonthlyReportDto();
    dto.year = 2025;
    dto.month = 0;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('month');
    expect(errors[0].constraints).toHaveProperty('min');
  });

  it('should fail validation with month greater than 12', async () => {
    const dto = new MonthlyReportDto();
    dto.year = 2025;
    dto.month = 13;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('month');
    expect(errors[0].constraints).toHaveProperty('max');
  });

  it('should fail validation with non-numeric values', async () => {
    const dto = new MonthlyReportDto();
    dto.year = 'abc' as any;
    dto.month = 'xyz' as any;

    const errors = await validate(dto);
    expect(errors.length).toBe(2);
  });

  it('should accept string values converted to numbers', async () => {
    const dto = new MonthlyReportDto();
    // Manually convert strings to numbers for testing
    dto.year = Number('2025');
    dto.month = Number('6');

    expect(typeof dto.year).toBe('number');
    expect(typeof dto.month).toBe('number');
    expect(dto.year).toBe(2025);
    expect(dto.month).toBe(6);

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
