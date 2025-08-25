# nocillax-rent-app

## Rental Management Application

A comprehensive rental management application with billing, payments, and tenant management.

### Core Billing Model: Running Month Billing

This application uses a "running month" billing model:

1. **Full Month Billing**:

   - Tenants pay for the FULL month regardless of move-in or move-out date
   - No proration is applied for partial month occupancy
   - If a tenant leaves mid-month, they are still responsible for the entire month's bill

2. **Bill Generation**:

   - Bills are automatically generated at the beginning of each month (1st day at 00:01)
   - Billing cycle is calendar month-based (1st to end of month)

3. **Tenant Closure Process**:

   - When a tenant is leaving, they are charged for the full current month
   - The final settlement applies advance payments first, then security deposit
   - Security deposits are only used for the final settlement, not for regular billing

4. **Payment Handling**:
   - Overpayments are stored as advance payments and carry over to future bills
   - Security deposits are separate from advance payments and only used at checkout

### System Architecture

- **Frontend**: Next.js application with Tailwind CSS
- **Backend**: NestJS with TypeORM for database management
- **Database**: PostgreSQL (configured via environment variables)

### Key Modules

- Tenant Management
- Apartment Management
- Billing System
- Payment Processing
- Report Generation
- Tenant Closure and Final Settlement
