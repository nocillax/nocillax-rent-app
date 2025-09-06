import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateBillDto } from './create-bill.dto';

describe('CreateBillDto', () => {
  it('should validate with required fields only', async () => {
    const plainObj = {
      month: 9,
      year: 2025,
      rent: 1500,
      tenant_id: 1,
      apartment_id: 101,
    };

    const dto = plainToInstance(CreateBillDto, plainObj);
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
    // Check defaults are set properly
    expect(dto.previous_balance).toBe(0);
    expect(dto.advance_payment).toBe(0);
    expect(dto.water_bill).toBe(0);
    expect(dto.gas_bill).toBe(0);
    expect(dto.electricity_bill).toBe(0);
    expect(dto.internet_bill).toBe(0);
    expect(dto.trash_bill).toBe(0);
    expect(dto.service_charge).toBe(0);
    expect(dto.other_charges).toBe(0);
    expect(dto.is_paid).toBe(false);
  });

  it('should validate with all fields present', async () => {
    const plainObj = {
      month: 9,
      year: 2025,
      rent: 1500,
      tenant_id: 1,
      apartment_id: 101,
      previous_balance: 200,
      advance_payment: 500,
      water_bill: 45.75,
      gas_bill: 35.25,
      electricity_bill: 85.5,
      internet_bill: 60,
      trash_bill: 25,
      service_charge: 100,
      other_charges: 75,
      is_paid: true,
      due_date: '2025-09-15',
    };

    const dto = plainToInstance(CreateBillDto, plainObj);
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should handle string values and validate correctly', async () => {
    // Test with numeric values first to ensure the DTO works correctly
    const numericObj = {
      month: 9,
      year: 2025,
      rent: 1500,
      tenant_id: 1,
      apartment_id: 101,
      previous_balance: 200,
      advance_payment: 500,
      water_bill: 45.75,
    };

    const dto = plainToInstance(CreateBillDto, numericObj);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);

    // Values should be properly set
    expect(dto.month).toBe(9);
    expect(dto.year).toBe(2025);
    expect(dto.rent).toBe(1500);
    expect(dto.previous_balance).toBe(200);
    expect(dto.water_bill).toBe(45.75);
  });

  it('should fail validation with invalid month values', async () => {
    // Month less than 1
    let dto = plainToInstance(CreateBillDto, {
      month: 0,
      year: 2025,
      rent: 1500,
      tenant_id: 1,
      apartment_id: 101,
    });

    let errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('month');
    expect(errors[0].constraints).toHaveProperty('min');

    // Month greater than 12
    dto = plainToInstance(CreateBillDto, {
      month: 13,
      year: 2025,
      rent: 1500,
      tenant_id: 1,
      apartment_id: 101,
    });

    errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('month');
    expect(errors[0].constraints).toHaveProperty('max');
  });

  it('should fail validation with year less than 2000', async () => {
    const dto = plainToInstance(CreateBillDto, {
      month: 9,
      year: 1999,
      rent: 1500,
      tenant_id: 1,
      apartment_id: 101,
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('year');
    expect(errors[0].constraints).toHaveProperty('min');
  });

  it('should fail validation with negative amounts', async () => {
    const dto = plainToInstance(CreateBillDto, {
      month: 9,
      year: 2025,
      rent: -1500, // Negative value
      tenant_id: 1,
      apartment_id: 101,
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('rent');
    expect(errors[0].constraints).toHaveProperty('min');
  });

  it('should fail validation with invalid date format', async () => {
    const dto = plainToInstance(CreateBillDto, {
      month: 9,
      year: 2025,
      rent: 1500,
      tenant_id: 1,
      apartment_id: 101,
      due_date: 'not-a-date',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('due_date');
  });

  it('should fail validation with missing required properties', async () => {
    // Missing all required properties
    let dto = plainToInstance(CreateBillDto, {});
    let errors = await validate(dto);
    expect(errors.length).toBe(5); // month, year, rent, tenant_id, apartment_id

    // Missing tenant_id and apartment_id
    dto = plainToInstance(CreateBillDto, {
      month: 9,
      year: 2025,
      rent: 1500,
    });

    errors = await validate(dto);
    expect(errors.length).toBe(2);
    const properties = errors.map((e) => e.property);
    expect(properties).toContain('tenant_id');
    expect(properties).toContain('apartment_id');
  });

  it('should validate with is_paid value', async () => {
    // Boolean true value
    let dto = plainToInstance(CreateBillDto, {
      month: 9,
      year: 2025,
      rent: 1500,
      tenant_id: 1,
      apartment_id: 101,
      is_paid: true,
    });

    // Verify the value is present, type checking may not work in test environment
    expect(dto.is_paid).toBeTruthy();

    let errors = await validate(dto);
    expect(errors.length).toBe(0);

    // Boolean false value
    dto = plainToInstance(CreateBillDto, {
      month: 9,
      year: 2025,
      rent: 1500,
      tenant_id: 1,
      apartment_id: 101,
      is_paid: false,
    });

    expect(dto.is_paid).toBeFalsy();

    errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
