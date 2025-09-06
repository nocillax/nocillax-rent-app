import { OtherCharge } from '../other-charge.entity';
import { Bill } from '../bill.entity';

describe('OtherCharge Entity', () => {
  it('should create a new other charge instance with all properties', () => {
    // Arrange
    const otherCharge = new OtherCharge();
    otherCharge.id = 1;
    otherCharge.name = 'Repair Fee';
    otherCharge.amount = 100;
    otherCharge.description = 'Fixing broken window';
    otherCharge.created_at = new Date();
    otherCharge.updated_at = new Date();
    otherCharge.bill_id = 5;

    // Assert
    expect(otherCharge).toBeDefined();
    expect(otherCharge.id).toBe(1);
    expect(otherCharge.name).toBe('Repair Fee');
    expect(otherCharge.amount).toBe(100);
    expect(otherCharge.description).toBe('Fixing broken window');
    expect(otherCharge.created_at).toBeInstanceOf(Date);
    expect(otherCharge.updated_at).toBeInstanceOf(Date);
    expect(otherCharge.bill_id).toBe(5);
  });

  it('should handle nullable fields correctly', () => {
    // Arrange
    const otherCharge = new OtherCharge();
    otherCharge.id = 1;
    otherCharge.name = 'Repair Fee';
    otherCharge.amount = 100;
    otherCharge.bill_id = 5;
    
    // Don't set nullable fields
    // description is nullable

    // Assert
    expect(otherCharge).toBeDefined();
    expect(otherCharge.description).toBeUndefined();
  });

  it('should handle the relationship with bill', () => {
    // Arrange
    const otherCharge = new OtherCharge();
    otherCharge.id = 1;
    otherCharge.name = 'Repair Fee';
    otherCharge.amount = 100;
    otherCharge.bill_id = 5;

    const bill = new Bill();
    bill.id = 5;
    bill.month = 6;
    bill.year = 2023;
    bill.tenant_id = 10;
    bill.apartment_id = 15;

    // Act
    otherCharge.bill = bill;

    // Assert
    expect(otherCharge.bill).toBeDefined();
    expect(otherCharge.bill.id).toBe(5);
    expect(otherCharge.bill.month).toBe(6);
    expect(otherCharge.bill.year).toBe(2023);
    expect(otherCharge.bill_id).toBe(otherCharge.bill.id);
  });
  
  it('should have properties for class definition', () => {
    // Check that the class is defined correctly
    expect(OtherCharge.name).toBe('OtherCharge');
    expect(typeof OtherCharge).toBe('function');
    expect(OtherCharge.prototype.constructor).toBe(OtherCharge);
  });
});