import { Payment } from '../payment.entity';
import { Tenant } from '../tenant.entity';

describe('Payment Entity', () => {
  it('should create a new payment instance with all properties', () => {
    // Arrange
    const payment = new Payment();
    payment.id = 1;
    payment.amount = 1500;
    payment.date = new Date('2023-05-15T10:30:00Z');
    payment.description = 'May rent payment';
    payment.payment_method = 'Credit Card';
    payment.reference_number = 'TRX123456789';
    payment.remaining_balance = 250;
    payment.created_at = new Date('2023-05-15T10:30:00Z');
    payment.updated_at = new Date('2023-05-15T10:30:00Z');
    payment.tenant_id = 5;

    // Assert
    expect(payment).toBeDefined();
    expect(payment.id).toBe(1);
    expect(payment.amount).toBe(1500);
    expect(payment.date).toBeInstanceOf(Date);
    expect(payment.description).toBe('May rent payment');
    expect(payment.payment_method).toBe('Credit Card');
    expect(payment.reference_number).toBe('TRX123456789');
    expect(payment.remaining_balance).toBe(250);
    expect(payment.created_at).toBeInstanceOf(Date);
    expect(payment.updated_at).toBeInstanceOf(Date);
    expect(payment.tenant_id).toBe(5);
  });

  it('should handle nullable fields correctly', () => {
    // Arrange
    const payment = new Payment();
    payment.id = 1;
    payment.amount = 1500;
    payment.date = new Date();
    payment.tenant_id = 5;

    // Don't set nullable fields
    // description, payment_method, reference_number, remaining_balance are all nullable

    // Assert
    expect(payment).toBeDefined();
    expect(payment.description).toBeUndefined();
    expect(payment.payment_method).toBeUndefined();
    expect(payment.reference_number).toBeUndefined();
    expect(payment.remaining_balance).toBeUndefined();
  });

  it('should handle the relationship with tenant', () => {
    // Arrange
    const payment = new Payment();
    payment.id = 1;
    payment.amount = 1500;
    payment.date = new Date();
    payment.tenant_id = 5;

    const tenant = new Tenant();
    tenant.id = 5;
    tenant.name = 'John Doe';
    tenant.apartment_id = 10;

    // Act
    payment.tenant = tenant;

    // Assert
    expect(payment.tenant).toBeDefined();
    expect(payment.tenant.id).toBe(5);
    expect(payment.tenant.name).toBe('John Doe');
    expect(payment.tenant_id).toBe(payment.tenant.id);
  });

  it('should have properties for class definition', () => {
    // Check that the class is defined correctly
    expect(Payment.name).toBe('Payment');
    expect(typeof Payment).toBe('function');
    expect(Payment.prototype.constructor).toBe(Payment);
  });
});
