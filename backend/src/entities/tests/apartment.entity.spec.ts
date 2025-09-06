import { Apartment } from '../apartment.entity';
import { Tenant } from '../tenant.entity';
import { Bill } from '../bill.entity';

describe('Apartment Entity', () => {
  it('should create a new apartment instance', () => {
    // Arrange
    const apartment = new Apartment();
    apartment.id = 1;
    apartment.name = 'Test Apartment';
    apartment.address = '123 Test St';
    apartment.description = 'Test Description';
    apartment.base_rent = 1000;
    apartment.is_active = true;
    apartment.created_at = new Date();
    apartment.updated_at = new Date();

    // Assert
    expect(apartment).toBeDefined();
    expect(apartment.id).toBe(1);
    expect(apartment.name).toBe('Test Apartment');
    expect(apartment.address).toBe('123 Test St');
    expect(apartment.description).toBe('Test Description');
    expect(apartment.base_rent).toBe(1000);
    expect(apartment.is_active).toBe(true);
    expect(apartment.created_at).toBeInstanceOf(Date);
    expect(apartment.updated_at).toBeInstanceOf(Date);
  });

  it('should handle relations with tenants', () => {
    // Arrange
    const apartment = new Apartment();
    apartment.id = 1;
    apartment.name = 'Test Apartment';

    const tenant1 = new Tenant();
    tenant1.id = 1;
    tenant1.name = 'Test Tenant 1';
    tenant1.apartment_id = apartment.id;
    tenant1.apartment = apartment;

    const tenant2 = new Tenant();
    tenant2.id = 2;
    tenant2.name = 'Test Tenant 2';
    tenant2.apartment_id = apartment.id;
    tenant2.apartment = apartment;

    // Act
    apartment.tenants = [tenant1, tenant2];

    // Assert
    expect(apartment.tenants).toHaveLength(2);
    expect(apartment.tenants[0].name).toBe('Test Tenant 1');
    expect(apartment.tenants[1].name).toBe('Test Tenant 2');
    expect(apartment.tenants[0].apartment_id).toBe(apartment.id);
    expect(apartment.tenants[1].apartment_id).toBe(apartment.id);
  });

  it('should handle relations with bills', () => {
    // Arrange
    const apartment = new Apartment();
    apartment.id = 1;
    apartment.name = 'Test Apartment';

    const bill1 = new Bill();
    bill1.id = 1;
    bill1.month = 1;
    bill1.year = 2023;
    bill1.apartment_id = apartment.id;
    bill1.apartment = apartment;

    const bill2 = new Bill();
    bill2.id = 2;
    bill2.month = 2;
    bill2.year = 2023;
    bill2.apartment_id = apartment.id;
    bill2.apartment = apartment;

    // Act
    apartment.bills = [bill1, bill2];

    // Assert
    expect(apartment.bills).toHaveLength(2);
    expect(apartment.bills[0].id).toBe(1);
    expect(apartment.bills[1].id).toBe(2);
    expect(apartment.bills[0].apartment_id).toBe(apartment.id);
    expect(apartment.bills[1].apartment_id).toBe(apartment.id);
  });

  it('should have properties for class definition', () => {
    // Check that the class is defined correctly
    expect(Apartment.name).toBe('Apartment');
    expect(typeof Apartment).toBe('function');
    expect(Apartment.prototype.constructor).toBe(Apartment);
  });
});