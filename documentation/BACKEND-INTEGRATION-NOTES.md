# Backend Integration Notes

> **Last Updated**: September 12, 2025
>
> **Document Type**: Technical Reference
>
> **Status**: Current

## Standard Utility Costs for Apartments

### Current Issue

The frontend now displays standard utility costs for all apartments (vacant or occupied), but this data doesn't exist in the backend model. When viewing a vacant apartment, these "standard" costs are hardcoded in the frontend but have no backend counterpart.

### Recommended Backend Changes

1. Add standard utility cost fields to the `Apartment` entity:

```typescript
// Add to apartment.entity.ts
@Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
standard_water_bill: number;

@Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
standard_electricity_bill: number;

@Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
standard_gas_bill: number;

@Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
standard_internet_bill: number;

@Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
standard_service_charge: number;

@Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
standard_trash_bill: number;
```

2. Modify the bill generation service to use these standard costs as initial values when creating bills:

```typescript
// Update in bill-generation.service.ts
const newBill = this.billsRepository.create({
  tenant_id: tenant.id,
  apartment_id: tenant.apartment_id,
  year,
  month,
  rent: tenant.apartment.base_rent,
  // Use standard rates from apartment when available
  water_bill: tenant.water_bill_enabled
    ? tenant.apartment.standard_water_bill
    : 0,
  gas_bill: tenant.gas_bill_enabled ? tenant.apartment.standard_gas_bill : 0,
  electricity_bill: tenant.electricity_bill_enabled
    ? tenant.apartment.standard_electricity_bill
    : 0,
  internet_bill: tenant.internet_bill_enabled
    ? tenant.apartment.standard_internet_bill
    : 0,
  service_charge: tenant.service_charge_enabled
    ? tenant.apartment.standard_service_charge
    : 0,
  trash_bill: tenant.trash_bill_enabled
    ? tenant.apartment.standard_trash_bill
    : 0,
  other_charges: 0,
  previous_balance: previousBalance,
  advance_payment: advancePayment,
  due_date: dueDate,
  is_paid: false,
});
```

3. Add a new API endpoint to update an apartment's standard utility costs:

```typescript
// Add to apartments.controller.ts
@Patch(':id/billing-structure')
updateBillingStructure(
  @Param('id') id: number,
  @Body() updateBillingDto: UpdateApartmentBillingDto
) {
  return this.apartmentsService.updateBillingStructure(id, updateBillingDto);
}
```

## Advance Payment vs. Security Deposit Clarification

### Current Issue

The frontend UI initially referred to the "advance payment" as if it were a prepayment for the first month's rent, which isn't accurate based on the backend implementation.

### Clarification

- **Security Deposit**: A refundable amount held for potential damages, returned at the end of the lease.
- **Advance Payment (Credit Balance)**: Represents overpayments made by the tenant that are carried forward to be applied to future bills automatically.

### Implementation Details

The backend's bill generation system already handles advance payments correctly:

- Any overpayment amount is stored in `tenant.advance_payment`
- This amount is applied to future bills automatically
- If the advance payment exceeds the bill amount, the bill is marked as paid and any remaining balance is kept in the tenant's account

## Estimated Total Rent Calculation

### Current Issue

The frontend shows an `estimatedTotalRent` value for apartments, but this calculation isn't standardized in the backend.

### Recommended Backend Change

Add a method to calculate the estimated total rent for an apartment based on standard utility costs:

```typescript
// Add to apartment.entity.ts
@ApiProperty({
  description: 'Estimated total monthly rent including standard utilities',
  example: 1750.0,
})
@Column({ type: 'decimal', precision: 10, scale: 2, default: 0,
  transformer: {
    to: (value) => value,
    from: (value) => {
      return this.base_rent +
        this.standard_water_bill +
        this.standard_electricity_bill +
        this.standard_gas_bill +
        this.standard_internet_bill +
        this.standard_service_charge +
        this.standard_trash_bill;
    }
  }
})
estimated_total_rent: number;
```

## Database Migration Plan

1. Create a migration to add the new standard utility cost fields to the apartment table
2. Implement data migration to populate default values for existing apartments
3. Update APIs to include the new fields in responses
4. Add validation rules for the new fields

## Frontend Alignment

Once these backend changes are implemented, update the frontend to:

1. Remove hardcoded standard utility costs
2. Use the values from the backend API response
3. Implement the "Edit Billing Structure" functionality to update the standard costs
