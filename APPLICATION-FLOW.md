# Application Flow Documentation

This document outlines the detailed flow of operations within the Nocillax Rent App, providing concrete examples of data flow and user interactions.

## Table of Contents

1. [Admin Authentication Flow](#admin-authentication-flow)
2. [New Tenant Onboarding Flow](#new-tenant-onboarding-flow)
3. [Apartment Management Flow](#apartment-management-flow)
4. [Monthly Billing Cycle Flow](#monthly-billing-cycle-flow)
5. [Payment Processing Flow](#payment-processing-flow)
6. [Tenant Checkout Flow](#tenant-checkout-flow)
7. [Reporting Flows](#reporting-flows)
8. [Dashboard Data Flow](#dashboard-data-flow)

---

## Admin Authentication Flow

### Login Process

1. **Admin navigates to login screen**

   - URL: `/login`
   - Interface displays username and password fields

2. **Admin enters credentials**

   ```
   Username: admin@example.com
   Password: securePassword123
   ```

3. **System validates credentials**

   - Backend endpoint: `POST /auth/login`
   - Request body:

   ```json
   {
     "username": "admin@example.com",
     "password": "securePassword123"
   }
   ```

4. **System generates JWT token**

   - Response:

   ```json
   {
     "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "expires_in": 3600
   }
   ```

5. **Client stores token in localStorage**

   - Token is used for all subsequent API requests in Authorization header

6. **System redirects to dashboard**
   - URL: `/dashboard`
   - Dashboard displays property summary and financial overview

### Token Validation Flow

1. **Client includes token with each request**

   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

2. **Backend validates token using JWT Strategy**
   - If valid: Request proceeds
   - If invalid/expired: Returns 401 Unauthorized
   - Client redirects to login page

---

## New Tenant Onboarding Flow

### Apartment Assignment

1. **Admin checks apartment availability**

   - Navigates to: `/apartments`
   - System displays list of apartments with status
   - Example available apartment:

   ```json
   {
     "id": 3,
     "number": "101B",
     "floor": 1,
     "rent_amount": 1200.0,
     "security_deposit_amount": 2400.0,
     "status": "vacant",
     "features": ["balcony", "air conditioning", "hardwood floors"],
     "size_sqft": 850
   }
   ```

2. **Admin selects vacant apartment**
   - Clicks "Assign Tenant" button on apartment #101B

### Tenant Creation

1. **Admin fills tenant details form**

   - Form at: `/tenants/create`
   - Tenant details:

   ```json
   {
     "name": "John Smith",
     "email": "john.smith@example.com",
     "phone": "555-123-4567",
     "emergency_contact": "Mary Smith, 555-765-4321",
     "lease_start": "2025-09-15",
     "lease_end": "2026-09-14",
     "apartment_id": 3,
     "security_deposit": 2400.0,
     "monthly_rent": 1200.0,
     "notes": "Has a small dog, pet deposit included"
   }
   ```

2. **System creates tenant record**

   - Backend endpoint: `POST /tenants`
   - System assigns apartment to tenant
   - Apartment status changes to "occupied"
   - System creates security deposit record

3. **System generates first bill**

   - Full month's rent generated regardless of move-in date
   - Bill details:

   ```json
   {
     "tenant_id": 42,
     "month": 9,
     "year": 2025,
     "due_date": "2025-09-30",
     "items": [
       {
         "description": "Monthly Rent - September 2025",
         "amount": 1200.0
       },
       {
         "description": "Security Deposit",
         "amount": 2400.0
       },
       {
         "description": "Pet Deposit",
         "amount": 300.0
       }
     ],
     "total": 3900.0,
     "is_paid": false
   }
   ```

4. **Admin receives confirmation**
   - Success message displayed
   - Option to print lease agreement
   - Option to collect initial payment

---

## Apartment Management Flow

### Adding New Apartment

1. **Admin navigates to apartment section**

   - URL: `/apartments`
   - Clicks "Add New Apartment" button

2. **Admin enters apartment details**

   ```json
   {
     "number": "203C",
     "floor": 2,
     "rent_amount": 1400.0,
     "security_deposit_amount": 2800.0,
     "status": "vacant",
     "features": ["renovated kitchen", "washer/dryer", "central AC"],
     "size_sqft": 950
   }
   ```

3. **System creates apartment record**
   - Backend endpoint: `POST /apartments`
   - New apartment appears in the listing with "Vacant" status

### Updating Apartment Details

1. **Admin selects existing apartment**
   - Clicks on apartment #101B in the listing
2. **Admin modifies details**
   - Updates rent_amount from $1200 to $1250
   - Backend endpoint: `PATCH /apartments/3`
3. **System handles rent change**
   - For vacant apartments: Simply updates the record
   - For occupied apartments:
     - Updates the record
     - Flags that future bills will use new rent amount

### Apartment Status Management

1. **System tracks apartment statuses**

   - `vacant`: Available for new tenants
   - `occupied`: Currently rented
   - `maintenance`: Under repair/renovation
   - `reserved`: Booked but not yet occupied

2. **Admin can change status manually**
   - Example: Setting apartment to "maintenance"
   - Backend creates maintenance record with estimated completion date

---

## Monthly Billing Cycle Flow

### Automated Bill Generation

1. **Scheduled task runs on 1st of month**

   - Cron job triggers at 00:01 AM
   - Calls backend endpoint: `POST /bills/generate`

2. **System identifies active tenants**

   - Queries all tenants with active leases
   - Example tenant list:

   ```json
   [
     {
       "id": 42,
       "name": "John Smith",
       "apartment_id": 3,
       "monthly_rent": 1200.0
     },
     {
       "id": 43,
       "name": "Alice Johnson",
       "apartment_id": 5,
       "monthly_rent": 1350.0
     }
   ]
   ```

3. **System generates monthly bills**

   - For each tenant, creates a bill record:

   ```json
   {
     "tenant_id": 42,
     "month": 10,
     "year": 2025,
     "due_date": "2025-10-31",
     "items": [
       {
         "description": "Monthly Rent - October 2025",
         "amount": 1200.0
       },
       {
         "description": "Utilities",
         "amount": 150.0
       }
     ],
     "subtotal": 1350.0,
     "tax": 0.0,
     "total": 1350.0,
     "is_paid": false,
     "bill_date": "2025-10-01"
   }
   ```

4. **System applies advance payments**
   - If tenant has advance payments:
   ```json
   {
     "tenant_id": 43,
     "advance_payment_balance": 500.0
   }
   ```
   - System automatically creates partial payment from advance:
   ```json
   {
     "tenant_id": 43,
     "bill_id": 156,
     "amount": 500.0,
     "payment_method": "Advance Payment Applied",
     "date": "2025-10-01",
     "description": "Automatic application of advance payment"
   }
   ```
   - Bill status updated to reflect partial payment

### Manual Bill Creation

1. **Admin creates special bill**

   - For one-time charges like repairs
   - Backend endpoint: `POST /bills`
   - Example special bill:

   ```json
   {
     "tenant_id": 42,
     "items": [
       {
         "description": "Window Repair",
         "amount": 250.0
       }
     ],
     "total": 250.0,
     "due_date": "2025-10-15",
     "is_paid": false
   }
   ```

2. **System notifies tenant**
   - Email sent with bill details
   - Bill appears in tenant's account

---

## Payment Processing Flow

### Recording Tenant Payment

1. **Admin navigates to payment screen**

   - URL: `/payments/create`

2. **Admin enters payment details**

   ```json
   {
     "tenant_id": 42,
     "amount": 1000.0,
     "payment_method": "Cash",
     "date": "2025-10-10",
     "reference_number": "PMT-10102025-42",
     "description": "Partial rent payment"
   }
   ```

3. **System processes payment**
   - Backend endpoint: `POST /payments`
   - System calculates remaining balance:
     - Total bills: $1350.00
     - Payment: $1000.00
     - Remaining: $350.00
4. **System updates payment record**

   ```json
   {
     "id": 78,
     "tenant_id": 42,
     "amount": 1000.0,
     "payment_method": "Cash",
     "date": "2025-10-10",
     "reference_number": "PMT-10102025-42",
     "description": "Partial rent payment",
     "remaining_balance": 350.0
   }
   ```

5. **System updates bill status**
   - Bill marked as "Partially Paid"
   - New bill status:
   ```json
   {
     "id": 155,
     "total": 1350.0,
     "amount_paid": 1000.0,
     "balance": 350.0,
     "status": "partially_paid"
   }
   ```

### Processing Overpayment

1. **Admin records payment larger than due amount**

   ```json
   {
     "tenant_id": 42,
     "amount": 1500.0,
     "payment_method": "Bank Transfer",
     "date": "2025-10-20",
     "reference_number": "BT-20102025-42",
     "description": "Full rent plus advance"
   }
   ```

2. **System handles the overpayment**
   - Backend calculates:
     - Remaining balance: $350.00
     - Payment: $1500.00
     - Excess: $1150.00
3. **System allocates payment**
   - First $350.00 applied to current bill
   - Bill marked as "Paid"
   - Remaining $1150.00 stored as advance payment
4. **System updates tenant record**

   ```json
   {
     "id": 42,
     "advance_payment": 1150.0
   }
   ```

5. **Admin receives confirmation**
   - Success message
   - Option to print receipt

---

## Tenant Checkout Flow

### Initiating Checkout

1. **Admin initiates tenant checkout**
   - Navigates to tenant profile
   - URL: `/tenants/42`
   - Clicks "Process Checkout" button
2. **Admin enters checkout details**

   ```json
   {
     "checkout_date": "2025-11-15",
     "final_inspection_date": "2025-11-16",
     "notes": "Minor wear and tear, no damages"
   }
   ```

3. **System calculates final settlement**
   - Tenant data:
   ```json
   {
     "id": 42,
     "security_deposit": 2400.0,
     "advance_payment": 1150.0,
     "unpaid_bills": 0.0
   }
   ```

### Processing Security Deposit Refund

1. **Admin records any deductions**

   ```json
   {
     "deductions": [
       {
         "description": "Wall repair - living room",
         "amount": 350.0
       },
       {
         "description": "Cleaning service",
         "amount": 200.0
       }
     ],
     "total_deductions": 550.0
   }
   ```

2. **System calculates refund amount**

   - Security deposit: $2400.00
   - Deductions: $550.00
   - Advance payment: $1150.00
   - Total refund: $3000.00 ($2400 - $550 + $1150)

3. **Admin records refund**

   ```json
   {
     "refund_amount": 3000.0,
     "refund_method": "Bank Transfer",
     "refund_date": "2025-11-20",
     "reference_number": "REF-20112025-42"
   }
   ```

4. **System finalizes checkout**
   - Tenant status changed to "Former"
   - Apartment status changed to "Vacant"
   - System generates final account statement
   - Backend endpoint: `POST /tenants/42/checkout`

---

## Reporting Flows

### Monthly Statement Generation

1. **Admin requests monthly statement**
   - Navigates to Reports section
   - URL: `/reports`
   - Selects "Monthly Statement" for October 2025
2. **System generates report**

   - Backend endpoint: `GET /reports/monthly-statement/2025/10`
   - System compiles data:
     - All bills generated in the month
     - All payments received in the month
     - Current tenant balances
     - Occupancy rate

3. **System delivers PDF report**
   - PDF includes:
     - Total revenue: $15,750.00
     - Outstanding balance: $2,300.00
     - Collection rate: 85.4%
     - Number of active tenants: 12
     - Vacant units: 3

### Tenant Statement Generation

1. **Admin requests tenant statement**
   - From tenant profile
   - Selects date range: "2025-09-01" to "2025-10-31"
2. **System compiles tenant data**

   - Backend endpoint: `GET /reports/tenant/42?start=2025-09-01&end=2025-10-31`
   - System retrieves:
     - All bills for the tenant in date range
     - All payments made by tenant in date range
     - Beginning and ending balance

3. **System generates PDF statement**
   - PDF includes:
     - Tenant information
     - Transaction history
     - Payment history
     - Current balance
     - Advance payment balance

---

## Dashboard Data Flow

### Financial Summary Generation

1. **Admin opens dashboard**
   - URL: `/dashboard`
2. **System requests financial data**
   - Backend endpoint: `GET /dashboard/financial-summary`
   - Response contains:
   ```json
   {
     "current_month": {
       "total_billed": 17500.0,
       "total_collected": 15200.0,
       "collection_rate": 86.9,
       "outstanding_balance": 2300.0
     },
     "previous_month": {
       "total_billed": 17200.0,
       "total_collected": 16800.0,
       "collection_rate": 97.7,
       "outstanding_balance": 400.0
     },
     "year_to_date": {
       "total_billed": 157000.0,
       "total_collected": 155200.0,
       "collection_rate": 98.9
     }
   }
   ```

### Tenant Status Overview

1. **System requests tenant payment statuses**
   - Backend endpoint: `GET /dashboard/tenant-statuses`
   - Response contains:
   ```json
   {
     "total_tenants": 12,
     "payment_status": {
       "paid_in_full": 8,
       "partially_paid": 3,
       "unpaid": 1
     },
     "tenants_with_balance": [
       {
         "id": 45,
         "name": "Michael Brown",
         "apartment": "104C",
         "balance": 1350.0,
         "last_payment_date": null,
         "days_overdue": 15
       },
       {
         "id": 47,
         "name": "Sarah Wilson",
         "apartment": "202A",
         "balance": 650.0,
         "last_payment_date": "2025-10-10",
         "days_overdue": 5
       },
       {
         "id": 49,
         "name": "David Miller",
         "apartment": "305B",
         "balance": 300.0,
         "last_payment_date": "2025-10-15",
         "days_overdue": 0
       }
     ]
   }
   ```

### Yearly Summary View

1. **Admin selects year view**
   - Selects year: 2025
2. **System requests yearly data**

   - Backend endpoint: `GET /dashboard/yearly-summary/2025`
   - System returns monthly breakdown:

   ```json
   {
     "year": 2025,
     "months": [
       {
         "month": 1,
         "total_billed": 16500.0,
         "total_collected": 16500.0,
         "occupancy_rate": 92
       },
       {
         "month": 2,
         "total_billed": 16500.0,
         "total_collected": 16200.0,
         "occupancy_rate": 92
       },
       // ... remaining months
       {
         "month": 10,
         "total_billed": 17500.0,
         "total_collected": 15200.0,
         "occupancy_rate": 86
       }
     ],
     "yearly_totals": {
       "total_billed": 157000.0,
       "total_collected": 155200.0,
       "average_occupancy": 90.5
     }
   }
   ```

3. **Dashboard renders data visualization**
   - Bar chart showing monthly totals
   - Line graph showing occupancy trends
   - Summary metrics for the year
