# Backend Changes Summary

> **Last Updated**: September 12, 2025
>
> **Document Type**: Technical Notes
>
> **Status**: Current

## Terminology Change: `advance_payment` to `credit_balance`

We renamed `advance_payment` to `credit_balance` in the tenant entity to better represent what this field actually does - track overpayment that can be applied to future bills.

### Files Changed:

- `src/entities/tenant.entity.ts` - Renamed field and updated JSDoc
- `src/tenants/tenants.service.ts` - Updated references to use credit_balance
- `src/bills/bills.service.ts` - Updated references to credit_balance
- `src/bills/bill-generation.service.ts` - Updated to use credit_balance in bill generation logic

## New Feature: Standard Utility Costs for Apartments

We added standard utility costs to apartments so that each apartment has a baseline billing structure that can be used when creating bills for tenants.

### Files Changed:

- `src/entities/apartment.entity.ts` - Added fields for standard utility costs and estimated total rent
- `src/apartments/apartments.service.ts` - Added `updateBillingStructure` method
- `src/apartments/apartments.controller.ts` - Added endpoint for updating billing structure
- `src/dto/apartment/update-apartment-billing.dto.ts` - Created DTO for updating billing structure

## Migration

We created a migration script to update the database schema:

- `src/migrations/1694528700000-AddStandardUtilityAndRenameCreditBalance.ts`

This script:

1. Adds standard utility cost columns to the apartments table
2. Renames advance_payment to credit_balance in the tenants table
3. Sets default values for all new columns

## Testing Status

Most tests have been updated, but some still need further fixing:

### Working Tests:

- Apartment entity tests
- Apartments service tests for updateBillingStructure
- Apartments controller tests

### Tests That Need Additional Work:

- Tenant service closure tests (previewClosure and processTenantClosure)
- Bill generation service tests
- Bills service tests

## Next Steps

1. Complete the test updates to ensure all tests pass
2. Update any frontend components that reference `advance_payment` to use `credit_balance` instead
3. Add UI for managing apartment standard utility costs
4. Test with real-world data to ensure billing works correctly
