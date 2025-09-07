import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Apartment } from '../apartment.entity';
import { Tenant } from '../tenant.entity';
import { Bill } from '../bill.entity';
import { Payment } from '../payment.entity';
import { OtherCharge } from '../other-charge.entity';

describe('Entity Relationships', () => {
  let apartmentRepository: Repository<Apartment>;
  let tenantRepository: Repository<Tenant>;
  let billRepository: Repository<Bill>;
  let paymentRepository: Repository<Payment>;
  let otherChargeRepository: Repository<OtherCharge>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Apartment),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Tenant),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Bill),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Payment),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(OtherCharge),
          useClass: Repository,
        },
      ],
    }).compile();

    apartmentRepository = moduleRef.get<Repository<Apartment>>(
      getRepositoryToken(Apartment),
    );
    tenantRepository = moduleRef.get<Repository<Tenant>>(
      getRepositoryToken(Tenant),
    );
    billRepository = moduleRef.get<Repository<Bill>>(getRepositoryToken(Bill));
    paymentRepository = moduleRef.get<Repository<Payment>>(
      getRepositoryToken(Payment),
    );
    otherChargeRepository = moduleRef.get<Repository<OtherCharge>>(
      getRepositoryToken(OtherCharge),
    );
  });

  it('should establish complete relationships between apartment, tenants, bills, payments, and other charges', () => {
    // Create an apartment
    const apartment = new Apartment();
    apartment.id = 1;
    apartment.name = 'Test Apartment';
    apartment.address = '123 Main St';
    apartment.base_rent = 1000;

    // Create tenants for the apartment
    const tenant1 = new Tenant();
    tenant1.id = 1;
    tenant1.name = 'John Doe';
    tenant1.apartment_id = apartment.id;
    tenant1.apartment = apartment;

    const tenant2 = new Tenant();
    tenant2.id = 2;
    tenant2.name = 'Jane Smith';
    tenant2.apartment_id = apartment.id;
    tenant2.apartment = apartment;

    // Create bills for the tenants
    const bill1 = new Bill();
    bill1.id = 101;
    bill1.month = 5;
    bill1.year = 2023;
    bill1.tenant_id = tenant1.id;
    bill1.tenant = tenant1;
    bill1.apartment_id = apartment.id;
    bill1.apartment = apartment;
    bill1.rent = apartment.base_rent;
    bill1.water_bill = 50;
    bill1.total = 1050;

    const bill2 = new Bill();
    bill2.id = 102;
    bill2.month = 6;
    bill2.year = 2023;
    bill2.tenant_id = tenant1.id;
    bill2.tenant = tenant1;
    bill2.apartment_id = apartment.id;
    bill2.apartment = apartment;
    bill2.rent = apartment.base_rent;
    bill2.water_bill = 55;
    bill2.total = 1055;

    // Create payments for a tenant
    const payment1 = new Payment();
    payment1.id = 201;
    payment1.amount = 1000;
    payment1.date = new Date();
    payment1.tenant_id = tenant1.id;
    payment1.tenant = tenant1;

    const payment2 = new Payment();
    payment2.id = 202;
    payment2.amount = 1055;
    payment2.date = new Date();
    payment2.tenant_id = tenant1.id;
    payment2.tenant = tenant1;

    // Create other charges for a bill
    const otherCharge1 = new OtherCharge();
    otherCharge1.id = 301;
    otherCharge1.name = 'Repair';
    otherCharge1.amount = 100;
    otherCharge1.bill_id = bill1.id;
    otherCharge1.bill = bill1;

    const otherCharge2 = new OtherCharge();
    otherCharge2.id = 302;
    otherCharge2.name = 'Late Fee';
    otherCharge2.amount = 50;
    otherCharge2.bill_id = bill1.id;
    otherCharge2.bill = bill1;

    // Establish bidirectional relationships
    apartment.tenants = [tenant1, tenant2];
    apartment.bills = [bill1, bill2];

    tenant1.bills = [bill1, bill2];
    tenant1.payments = [payment1, payment2];

    bill1.other_charge_items = [otherCharge1, otherCharge2];
    bill1.other_charges = otherCharge1.amount + otherCharge2.amount;
    bill1.total += bill1.other_charges;

    // Verify apartment -> tenants relationship
    expect(apartment.tenants).toHaveLength(2);
    expect(apartment.tenants[0].id).toBe(tenant1.id);
    expect(apartment.tenants[1].id).toBe(tenant2.id);
    expect(apartment.tenants[0].apartment_id).toBe(apartment.id);
    expect(apartment.tenants[1].apartment_id).toBe(apartment.id);

    // Verify apartment -> bills relationship
    expect(apartment.bills).toHaveLength(2);
    expect(apartment.bills[0].id).toBe(bill1.id);
    expect(apartment.bills[1].id).toBe(bill2.id);
    expect(apartment.bills[0].apartment_id).toBe(apartment.id);
    expect(apartment.bills[1].apartment_id).toBe(apartment.id);

    // Verify tenant -> bills relationship
    expect(tenant1.bills).toHaveLength(2);
    expect(tenant1.bills[0].id).toBe(bill1.id);
    expect(tenant1.bills[1].id).toBe(bill2.id);
    expect(tenant1.bills[0].tenant_id).toBe(tenant1.id);
    expect(tenant1.bills[1].tenant_id).toBe(tenant1.id);

    // Verify tenant -> payments relationship
    expect(tenant1.payments).toHaveLength(2);
    expect(tenant1.payments[0].id).toBe(payment1.id);
    expect(tenant1.payments[1].id).toBe(payment2.id);
    expect(tenant1.payments[0].tenant_id).toBe(tenant1.id);
    expect(tenant1.payments[1].tenant_id).toBe(tenant1.id);

    // Verify bill -> tenant relationship
    expect(bill1.tenant).toBeDefined();
    expect(bill1.tenant.id).toBe(tenant1.id);
    expect(bill1.tenant_id).toBe(tenant1.id);

    // Verify bill -> apartment relationship
    expect(bill1.apartment).toBeDefined();
    expect(bill1.apartment.id).toBe(apartment.id);
    expect(bill1.apartment_id).toBe(apartment.id);

    // Verify bill -> other charges relationship
    expect(bill1.other_charge_items).toHaveLength(2);
    expect(bill1.other_charge_items[0].id).toBe(otherCharge1.id);
    expect(bill1.other_charge_items[1].id).toBe(otherCharge2.id);
    expect(bill1.other_charge_items[0].bill_id).toBe(bill1.id);
    expect(bill1.other_charge_items[1].bill_id).toBe(bill1.id);
    expect(bill1.other_charges).toBe(otherCharge1.amount + otherCharge2.amount);

    // Verify payment -> tenant relationship
    expect(payment1.tenant).toBeDefined();
    expect(payment1.tenant.id).toBe(tenant1.id);
    expect(payment1.tenant_id).toBe(tenant1.id);

    // Verify other charge -> bill relationship
    expect(otherCharge1.bill).toBeDefined();
    expect(otherCharge1.bill.id).toBe(bill1.id);
    expect(otherCharge1.bill_id).toBe(bill1.id);
  });

  it('should maintain referential integrity when removing entities', () => {
    // Create main entities
    const apartment = new Apartment();
    apartment.id = 1;
    apartment.name = 'Test Apartment';
    apartment.tenants = [];
    apartment.bills = [];

    const tenant = new Tenant();
    tenant.id = 1;
    tenant.name = 'John Doe';
    tenant.apartment = apartment;
    tenant.apartment_id = apartment.id;
    tenant.bills = [];
    tenant.payments = [];

    const bill = new Bill();
    bill.id = 101;
    bill.tenant = tenant;
    bill.tenant_id = tenant.id;
    bill.apartment = apartment;
    bill.apartment_id = apartment.id;
    bill.other_charge_items = [];

    apartment.tenants.push(tenant);
    apartment.bills.push(bill);
    tenant.bills.push(bill);

    // Create an other charge and add to bill
    const otherCharge = new OtherCharge();
    otherCharge.id = 201;
    otherCharge.name = 'Extra Fee';
    otherCharge.amount = 50;
    otherCharge.bill = bill;
    otherCharge.bill_id = bill.id;
    bill.other_charge_items.push(otherCharge);

    // Test removing other charge
    const otherChargeIndex = bill.other_charge_items.findIndex(
      (charge) => charge.id === otherCharge.id,
    );
    bill.other_charge_items.splice(otherChargeIndex, 1);
    expect(bill.other_charge_items).toHaveLength(0);

    // Test removing bill from tenant and apartment
    const billIndexTenant = tenant.bills.findIndex((b) => b.id === bill.id);
    tenant.bills.splice(billIndexTenant, 1);

    const billIndexApartment = apartment.bills.findIndex(
      (b) => b.id === bill.id,
    );
    apartment.bills.splice(billIndexApartment, 1);

    expect(tenant.bills).toHaveLength(0);
    expect(apartment.bills).toHaveLength(0);

    // Test removing tenant from apartment
    const tenantIndex = apartment.tenants.findIndex((t) => t.id === tenant.id);
    apartment.tenants.splice(tenantIndex, 1);
    expect(apartment.tenants).toHaveLength(0);
  });

  it('should update total bill amount when other charges change', () => {
    // Create a bill
    const bill = new Bill();
    bill.id = 101;
    bill.rent = 1000;
    bill.water_bill = 50;
    bill.gas_bill = 30;
    bill.electricity_bill = 80;
    bill.other_charges = 0;
    bill.total = 1160; // Sum of all charges
    bill.other_charge_items = [];

    // Add other charges
    const otherCharge1 = new OtherCharge();
    otherCharge1.id = 201;
    otherCharge1.name = 'Repair';
    otherCharge1.amount = 100;
    otherCharge1.bill = bill;
    otherCharge1.bill_id = bill.id;

    const otherCharge2 = new OtherCharge();
    otherCharge2.id = 202;
    otherCharge2.name = 'Late Fee';
    otherCharge2.amount = 50;
    otherCharge2.bill = bill;
    otherCharge2.bill_id = bill.id;

    bill.other_charge_items.push(otherCharge1, otherCharge2);

    // Update other_charges and total
    bill.other_charges = bill.other_charge_items.reduce(
      (sum, charge) => sum + charge.amount,
      0,
    );
    bill.total =
      bill.rent +
      bill.water_bill +
      bill.gas_bill +
      bill.electricity_bill +
      bill.other_charges;

    expect(bill.other_charges).toBe(150);
    expect(bill.total).toBe(1310);

    // Remove one charge
    bill.other_charge_items.pop(); // Remove the last charge (Late Fee)

    // Update other_charges and total again
    bill.other_charges = bill.other_charge_items.reduce(
      (sum, charge) => sum + charge.amount,
      0,
    );
    bill.total =
      bill.rent +
      bill.water_bill +
      bill.gas_bill +
      bill.electricity_bill +
      bill.other_charges;

    expect(bill.other_charges).toBe(100);
    expect(bill.total).toBe(1260);
  });
});
