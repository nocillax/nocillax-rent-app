import { Tenant } from '../tenant.entity';
import { Apartment } from '../apartment.entity';
import { Bill } from '../bill.entity';
import { Payment } from '../payment.entity';

describe('Tenant Entity', () => {
  it('should create a new tenant instance with all properties', () => {
    // Arrange
    const tenant = new Tenant();
    tenant.id = 1;
    tenant.name = 'John Doe';
    tenant.phone_number = '1234567890';
    tenant.nid = 'ABC123';
    tenant.photo_url = 'http://example.com/photo.jpg';
    tenant.meter_number = 'M12345';
    tenant.is_active = true;
    tenant.credit_balance = 500;
    tenant.security_deposit = 2000;
    tenant.water_bill_enabled = true;
    tenant.gas_bill_enabled = true;
    tenant.electricity_bill_enabled = true;
    tenant.internet_bill_enabled = true;
    tenant.service_charge_enabled = true;
    tenant.trash_bill_enabled = true;
    tenant.created_at = new Date();
    tenant.updated_at = new Date();
    tenant.apartment_id = 1;

    // Assert
    expect(tenant).toBeDefined();
    expect(tenant.id).toBe(1);
    expect(tenant.name).toBe('John Doe');
    expect(tenant.phone_number).toBe('1234567890');
    expect(tenant.nid).toBe('ABC123');
    expect(tenant.photo_url).toBe('http://example.com/photo.jpg');
    expect(tenant.meter_number).toBe('M12345');
    expect(tenant.is_active).toBe(true);
    expect(tenant.credit_balance).toBe(500);
    expect(tenant.security_deposit).toBe(2000);
    expect(tenant.water_bill_enabled).toBe(true);
    expect(tenant.gas_bill_enabled).toBe(true);
    expect(tenant.electricity_bill_enabled).toBe(true);
    expect(tenant.internet_bill_enabled).toBe(true);
    expect(tenant.service_charge_enabled).toBe(true);
    expect(tenant.trash_bill_enabled).toBe(true);
    expect(tenant.created_at).toBeInstanceOf(Date);
    expect(tenant.updated_at).toBeInstanceOf(Date);
    expect(tenant.apartment_id).toBe(1);
  });

  it('should handle nullable fields correctly', () => {
    // Arrange
    const tenant = new Tenant();
    tenant.id = 1;
    tenant.name = 'John Doe';
    tenant.apartment_id = 1;

    // Don't set nullable fields
    // phone_number, nid, photo_url, meter_number are all nullable

    // Assert
    expect(tenant).toBeDefined();
    expect(tenant.phone_number).toBeUndefined();
    expect(tenant.nid).toBeUndefined();
    expect(tenant.photo_url).toBeUndefined();
    expect(tenant.meter_number).toBeUndefined();
  });

  it('should handle the relationship with apartment', () => {
    // Arrange
    const tenant = new Tenant();
    tenant.id = 1;
    tenant.name = 'John Doe';
    tenant.apartment_id = 5;

    const apartment = new Apartment();
    apartment.id = 5;
    apartment.name = 'Test Apartment';
    apartment.address = '123 Test St';

    // Act
    tenant.apartment = apartment;

    // Assert
    expect(tenant.apartment).toBeDefined();
    expect(tenant.apartment.id).toBe(5);
    expect(tenant.apartment.name).toBe('Test Apartment');
    expect(tenant.apartment_id).toBe(tenant.apartment.id);
  });

  it('should handle the relationship with bills', () => {
    // Arrange
    const tenant = new Tenant();
    tenant.id = 1;
    tenant.name = 'John Doe';

    const bill1 = new Bill();
    bill1.id = 101;
    bill1.month = 1;
    bill1.year = 2023;
    bill1.tenant_id = tenant.id;

    const bill2 = new Bill();
    bill2.id = 102;
    bill2.month = 2;
    bill2.year = 2023;
    bill2.tenant_id = tenant.id;

    // Act
    tenant.bills = [bill1, bill2];

    // Assert
    expect(tenant.bills).toHaveLength(2);
    expect(tenant.bills[0].id).toBe(101);
    expect(tenant.bills[1].id).toBe(102);
    expect(tenant.bills[0].tenant_id).toBe(tenant.id);
    expect(tenant.bills[1].tenant_id).toBe(tenant.id);
  });

  it('should handle the relationship with payments', () => {
    // Arrange
    const tenant = new Tenant();
    tenant.id = 1;
    tenant.name = 'John Doe';

    const payment1 = new Payment();
    payment1.id = 201;
    payment1.amount = 1000;
    payment1.date = new Date();
    payment1.tenant_id = tenant.id;

    const payment2 = new Payment();
    payment2.id = 202;
    payment2.amount = 1500;
    payment2.date = new Date();
    payment2.tenant_id = tenant.id;

    // Act
    tenant.payments = [payment1, payment2];

    // Assert
    expect(tenant.payments).toHaveLength(2);
    expect(tenant.payments[0].id).toBe(201);
    expect(tenant.payments[1].id).toBe(202);
    expect(tenant.payments[0].tenant_id).toBe(tenant.id);
    expect(tenant.payments[1].tenant_id).toBe(tenant.id);
  });

  it('should have properties for class definition', () => {
    // Check that the class is defined correctly
    expect(Tenant.name).toBe('Tenant');
    expect(typeof Tenant).toBe('function');
    expect(Tenant.prototype.constructor).toBe(Tenant);
  });
});
