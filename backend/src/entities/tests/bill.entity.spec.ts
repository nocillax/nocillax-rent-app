import { Bill } from '../bill.entity';
import { Tenant } from '../tenant.entity';
import { Apartment } from '../apartment.entity';
import { OtherCharge } from '../other-charge.entity';

describe('Bill Entity', () => {
  it('should create a new bill instance with all properties', () => {
    // Arrange
    const bill = new Bill();
    bill.id = 1;
    bill.month = 5;
    bill.year = 2023;
    bill.previous_balance = 100;
    bill.advance_payment = 200;
    bill.due_date = new Date('2023-05-15');
    bill.rent = 1000;
    bill.water_bill = 50;
    bill.gas_bill = 30;
    bill.electricity_bill = 80;
    bill.internet_bill = 40;
    bill.service_charge = 100;
    bill.trash_bill = 20;
    bill.other_charges = 75;
    bill.total = 1295;
    bill.is_paid = false;
    bill.created_at = new Date();
    bill.last_edited_at = new Date();
    bill.tenant_id = 5;
    bill.apartment_id = 10;

    // Assert
    expect(bill).toBeDefined();
    expect(bill.id).toBe(1);
    expect(bill.month).toBe(5);
    expect(bill.year).toBe(2023);
    expect(bill.previous_balance).toBe(100);
    expect(bill.advance_payment).toBe(200);
    expect(bill.due_date).toBeInstanceOf(Date);
    expect(bill.rent).toBe(1000);
    expect(bill.water_bill).toBe(50);
    expect(bill.gas_bill).toBe(30);
    expect(bill.electricity_bill).toBe(80);
    expect(bill.internet_bill).toBe(40);
    expect(bill.service_charge).toBe(100);
    expect(bill.trash_bill).toBe(20);
    expect(bill.other_charges).toBe(75);
    expect(bill.total).toBe(1295);
    expect(bill.is_paid).toBe(false);
    expect(bill.created_at).toBeInstanceOf(Date);
    expect(bill.last_edited_at).toBeInstanceOf(Date);
    expect(bill.tenant_id).toBe(5);
    expect(bill.apartment_id).toBe(10);
  });

  it('should handle the relationship with tenant', () => {
    // Arrange
    const bill = new Bill();
    bill.id = 1;
    bill.month = 5;
    bill.year = 2023;
    bill.tenant_id = 5;

    const tenant = new Tenant();
    tenant.id = 5;
    tenant.name = 'John Doe';
    tenant.apartment_id = 10;

    // Act
    bill.tenant = tenant;

    // Assert
    expect(bill.tenant).toBeDefined();
    expect(bill.tenant.id).toBe(5);
    expect(bill.tenant.name).toBe('John Doe');
    expect(bill.tenant_id).toBe(bill.tenant.id);
  });

  it('should handle the relationship with apartment', () => {
    // Arrange
    const bill = new Bill();
    bill.id = 1;
    bill.month = 5;
    bill.year = 2023;
    bill.apartment_id = 10;

    const apartment = new Apartment();
    apartment.id = 10;
    apartment.name = 'Test Apartment';
    apartment.address = '123 Test St';

    // Act
    bill.apartment = apartment;

    // Assert
    expect(bill.apartment).toBeDefined();
    expect(bill.apartment.id).toBe(10);
    expect(bill.apartment.name).toBe('Test Apartment');
    expect(bill.apartment_id).toBe(bill.apartment.id);
  });

  it('should handle the relationship with other charge items', () => {
    // Arrange
    const bill = new Bill();
    bill.id = 1;
    bill.month = 5;
    bill.year = 2023;
    bill.other_charges = 150;

    const otherCharge1 = new OtherCharge();
    otherCharge1.id = 101;
    otherCharge1.name = 'Repair';
    otherCharge1.amount = 100;
    otherCharge1.bill_id = bill.id;
    otherCharge1.bill = bill;

    const otherCharge2 = new OtherCharge();
    otherCharge2.id = 102;
    otherCharge2.name = 'Late Fee';
    otherCharge2.amount = 50;
    otherCharge2.bill_id = bill.id;
    otherCharge2.bill = bill;

    // Act
    bill.other_charge_items = [otherCharge1, otherCharge2];

    // Assert
    expect(bill.other_charge_items).toHaveLength(2);
    expect(bill.other_charge_items[0].id).toBe(101);
    expect(bill.other_charge_items[1].id).toBe(102);
    expect(bill.other_charge_items[0].name).toBe('Repair');
    expect(bill.other_charge_items[1].name).toBe('Late Fee');
    expect(bill.other_charge_items[0].amount).toBe(100);
    expect(bill.other_charge_items[1].amount).toBe(50);
    expect(bill.other_charge_items[0].bill_id).toBe(bill.id);
    expect(bill.other_charge_items[1].bill_id).toBe(bill.id);

    // Verify that the sum of other charges matches the bill's other_charges property
    const totalOtherCharges = bill.other_charge_items.reduce(
      (sum, charge) => sum + charge.amount,
      0,
    );
    expect(totalOtherCharges).toBe(bill.other_charges);
  });

  it('should handle nullable fields correctly', () => {
    // Arrange
    const bill = new Bill();
    bill.id = 1;
    bill.month = 5;
    bill.year = 2023;
    bill.tenant_id = 5;
    bill.apartment_id = 10;

    // Don't set due_date which is nullable

    // Assert
    expect(bill).toBeDefined();
    expect(bill.due_date).toBeUndefined();
  });

  it('should have properties for class definition', () => {
    // Check that the class is defined correctly
    expect(Bill.name).toBe('Bill');
    expect(typeof Bill).toBe('function');
    expect(Bill.prototype.constructor).toBe(Bill);
  });
});
