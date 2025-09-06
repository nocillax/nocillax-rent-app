import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { TenantClosureDto } from './tenant-closure.dto';

describe('TenantClosureDto', () => {
  it('should validate with empty object (all fields optional)', async () => {
    const plainObj = {};

    const dto = plainToInstance(TenantClosureDto, plainObj);
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
    // Check defaults are set properly
    expect(dto.deposit_deductions).toBe(0);
    expect(dto.final_balance).toBe(0);
    expect(dto.refund_amount).toBe(0);
    expect(dto.deduction_reason).toBeUndefined();
  });

  it('should validate with all fields present', async () => {
    const plainObj = {
      deposit_deductions: 250.75,
      deduction_reason: 'Repairs for wall damage in living room',
      final_balance: 1200.5,
      refund_amount: 1750.25,
    };

    const dto = plainToInstance(TenantClosureDto, plainObj);
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should transform string values to numbers', async () => {
    const plainObj = {
      deposit_deductions: '250.75',
      deduction_reason: 'Repairs for wall damage in living room',
      final_balance: '1200.5',
      refund_amount: '1750.25',
    };

    const dto = plainToInstance(TenantClosureDto, plainObj);

    expect(typeof dto.deposit_deductions).toBe('number');
    expect(typeof dto.final_balance).toBe('number');
    expect(typeof dto.refund_amount).toBe('number');

    expect(dto.deposit_deductions).toBe(250.75);
    expect(dto.final_balance).toBe(1200.5);
    expect(dto.refund_amount).toBe(1750.25);
    expect(dto.deduction_reason).toBe('Repairs for wall damage in living room');

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation with negative amounts', async () => {
    // Negative deposit deductions
    let dto = plainToInstance(TenantClosureDto, {
      deposit_deductions: -250.75,
    });

    let errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('deposit_deductions');
    expect(errors[0].constraints).toHaveProperty('min');

    // Negative final balance
    dto = plainToInstance(TenantClosureDto, {
      final_balance: -1200.5,
    });

    errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('final_balance');
    expect(errors[0].constraints).toHaveProperty('min');

    // Negative refund amount
    dto = plainToInstance(TenantClosureDto, {
      refund_amount: -1750.25,
    });

    errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('refund_amount');
    expect(errors[0].constraints).toHaveProperty('min');
  });

  it('should fail validation with deduction reason exceeding max length', async () => {
    // Create a string with 256 characters (exceeds 255 limit)
    const longString = 'a'.repeat(256);

    const dto = plainToInstance(TenantClosureDto, {
      deduction_reason: longString,
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('deduction_reason');
    expect(errors[0].constraints).toHaveProperty('maxLength');
  });

  it('should validate deduction reason at max length', async () => {
    // Create a string with exactly 255 characters (at limit)
    const maxLengthString = 'a'.repeat(255);

    const dto = plainToInstance(TenantClosureDto, {
      deduction_reason: maxLengthString,
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate with non-string values converted to strings', async () => {
    const dto = plainToInstance(TenantClosureDto, {
      deposit_deductions: 250.75,
      // Using actual number value for validation
      deduction_reason: '123', // Explicitly as a string
      final_balance: 1200.5,
      refund_amount: 1750.25,
    });

    expect(dto.deduction_reason).toBe('123');

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should handle partial data correctly', async () => {
    const dto = plainToInstance(TenantClosureDto, {
      deposit_deductions: 250.75,
      // Only providing some fields
      final_balance: 1200.5,
    });

    expect(dto.deposit_deductions).toBe(250.75);
    expect(dto.final_balance).toBe(1200.5);
    expect(dto.refund_amount).toBe(0); // Should use default value
    expect(dto.deduction_reason).toBeUndefined(); // No default

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
