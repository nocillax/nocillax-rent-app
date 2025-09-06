# API Documentation

This document provides a comprehensive guide to the Nocillax Rent App API endpoints, including request/response formats, authentication requirements, and sample payloads.

## Base URL

All API endpoints use the base URL: `/api/v1/`

## Authentication

All endpoints except login are protected and require authentication via JWT token.

### Login

- **URL**: `POST /auth/login`
- **Description**: Authenticates a user and returns access token
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "username": "admin",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "username": "admin",
    "expires_in": 3600
  }
  ```
- **Error Response** (401 Unauthorized):
  ```json
  {
    "statusCode": 401,
    "message": "Invalid credentials",
    "error": "Unauthorized"
  }
  ```

### Logout

- **URL**: `POST /auth/logout`
- **Description**: Invalidates the current user session
- **Auth Required**: Yes
- **Response**:
  ```json
  {
    "message": "Logout successful"
  }
  ```

## Apartments

### Get All Apartments

- **URL**: `GET /apartments`
- **Description**: Retrieves a list of all apartments
- **Auth Required**: Yes
- **Response**:
  ```json
  [
    {
      "id": 1,
      "apartment_number": "101",
      "floor": 1,
      "building": "A",
      "rent_amount": 1500,
      "security_deposit": 3000,
      "bedrooms": 2,
      "bathrooms": 1,
      "square_feet": 850,
      "is_furnished": true,
      "is_occupied": true,
      "created_at": "2025-07-15T10:30:00Z",
      "updated_at": "2025-08-01T14:15:00Z"
    }
    // More apartments...
  ]
  ```

### Get Apartment by ID

- **URL**: `GET /apartments/:id`
- **Description**: Retrieves details of a specific apartment
- **Auth Required**: Yes
- **Response**:
  ```json
  {
    "id": 1,
    "apartment_number": "101",
    "floor": 1,
    "building": "A",
    "rent_amount": 1500,
    "security_deposit": 3000,
    "bedrooms": 2,
    "bathrooms": 1,
    "square_feet": 850,
    "is_furnished": true,
    "is_occupied": true,
    "created_at": "2025-07-15T10:30:00Z",
    "updated_at": "2025-08-01T14:15:00Z"
  }
  ```
- **Error Response** (404 Not Found):
  ```json
  {
    "statusCode": 404,
    "message": "Apartment not found",
    "error": "Not Found"
  }
  ```

### Get Apartment Bills

- **URL**: `GET /apartments/:id/bills`
- **Description**: Retrieves all bills associated with a specific apartment
- **Auth Required**: Yes
- **Response**:
  ```json
  [
    {
      "id": 123,
      "month": 8,
      "year": 2025,
      "rent": 1500,
      "water_bill": 45.75,
      "electricity_bill": 85.5,
      "gas_bill": 35.25,
      "internet_bill": 60,
      "trash_bill": 25,
      "service_charge": 100,
      "other_charges": 0,
      "previous_balance": 0,
      "advance_payment": 0,
      "total_amount": 1851.5,
      "is_paid": false,
      "due_date": "2025-08-05T00:00:00Z",
      "tenant_id": 42,
      "apartment_id": 1
    }
    // More bills...
  ]
  ```

### Get Apartment Tenants

- **URL**: `GET /apartments/:id/tenants`
- **Description**: Retrieves all tenants living in a specific apartment
- **Auth Required**: Yes
- **Response**:
  ```json
  [
    {
      "id": 42,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "lease_start_date": "2025-01-01T00:00:00Z",
      "lease_end_date": "2025-12-31T00:00:00Z",
      "security_deposit": 3000,
      "is_active": true,
      "apartment_id": 1,
      "created_at": "2025-01-01T10:00:00Z",
      "updated_at": "2025-01-01T10:00:00Z"
    }
    // More tenants...
  ]
  ```

### Create Apartment

- **URL**: `POST /apartments`
- **Description**: Creates a new apartment
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "apartment_number": "202",
    "floor": 2,
    "building": "B",
    "rent_amount": 1700,
    "security_deposit": 3400,
    "bedrooms": 2,
    "bathrooms": 2,
    "square_feet": 950,
    "is_furnished": false,
    "is_occupied": false
  }
  ```
- **Response** (201 Created):
  ```json
  {
    "id": 2,
    "apartment_number": "202",
    "floor": 2,
    "building": "B",
    "rent_amount": 1700,
    "security_deposit": 3400,
    "bedrooms": 2,
    "bathrooms": 2,
    "square_feet": 950,
    "is_furnished": false,
    "is_occupied": false,
    "created_at": "2025-08-22T09:15:30Z",
    "updated_at": "2025-08-22T09:15:30Z"
  }
  ```

### Update Apartment

- **URL**: `PUT /apartments/:id`
- **Description**: Updates an existing apartment's details
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "rent_amount": 1800,
    "is_furnished": true
  }
  ```
- **Response**:
  ```json
  {
    "id": 2,
    "apartment_number": "202",
    "floor": 2,
    "building": "B",
    "rent_amount": 1800,
    "security_deposit": 3400,
    "bedrooms": 2,
    "bathrooms": 2,
    "square_feet": 950,
    "is_furnished": true,
    "is_occupied": false,
    "created_at": "2025-08-22T09:15:30Z",
    "updated_at": "2025-08-22T10:45:15Z"
  }
  ```

### Delete Apartment

- **URL**: `DELETE /apartments/:id`
- **Description**: Removes an apartment from the system
- **Auth Required**: Yes
- **Response** (200 OK):
  ```json
  {
    "message": "Apartment deleted successfully"
  }
  ```

## Tenants

### Get All Tenants

- **URL**: `GET /tenants`
- **Description**: Retrieves a list of all active tenants
- **Auth Required**: Yes
- **Query Parameters**:
  - `apartmentId` (optional): Filter tenants by apartment ID
- **Response**:
  ```json
  [
    {
      "id": 42,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "lease_start_date": "2025-01-01T00:00:00Z",
      "lease_end_date": "2025-12-31T00:00:00Z",
      "security_deposit": 3000,
      "is_active": true,
      "apartment_id": 1,
      "created_at": "2025-01-01T10:00:00Z",
      "updated_at": "2025-01-01T10:00:00Z"
    }
    // More tenants...
  ]
  ```

### Get Archived Tenants

- **URL**: `GET /tenants/archive`
- **Description**: Retrieves a list of all archived (inactive) tenants
- **Auth Required**: Yes
- **Response**: Same format as Get All Tenants but with `is_active: false`

### Get Tenant by ID

- **URL**: `GET /tenants/:id`
- **Description**: Retrieves details of a specific tenant
- **Auth Required**: Yes
- **Response**:
  ```json
  {
    "id": 42,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "lease_start_date": "2025-01-01T00:00:00Z",
    "lease_end_date": "2025-12-31T00:00:00Z",
    "security_deposit": 3000,
    "is_active": true,
    "apartment_id": 1,
    "created_at": "2025-01-01T10:00:00Z",
    "updated_at": "2025-01-01T10:00:00Z"
  }
  ```

### Get Tenant Bills

- **URL**: `GET /tenants/:id/bills`
- **Description**: Retrieves all bills for a specific tenant
- **Auth Required**: Yes
- **Response**:
  ```json
  [
    {
      "id": 123,
      "month": 8,
      "year": 2025,
      "rent": 1500,
      "water_bill": 45.75,
      "electricity_bill": 85.5,
      "gas_bill": 35.25,
      "internet_bill": 60,
      "trash_bill": 25,
      "service_charge": 100,
      "other_charges": 0,
      "previous_balance": 0,
      "advance_payment": 0,
      "total_amount": 1851.5,
      "is_paid": false,
      "due_date": "2025-08-05T00:00:00Z",
      "tenant_id": 42,
      "apartment_id": 1
    }
    // More bills...
  ]
  ```

### Get Tenant Payments

- **URL**: `GET /tenants/:id/payments`
- **Description**: Retrieves all payments made by a specific tenant
- **Auth Required**: Yes
- **Response**:
  ```json
  [
    {
      "id": 56,
      "amount": 1851.5,
      "date": "2025-08-03T14:30:00Z",
      "description": "August rent payment",
      "payment_method": "Credit Card",
      "reference_number": "TRX123456789",
      "tenant_id": 42,
      "created_at": "2025-08-03T14:30:00Z",
      "updated_at": "2025-08-03T14:30:00Z"
    }
    // More payments...
  ]
  ```

### Create Tenant

- **URL**: `POST /tenants`
- **Description**: Creates a new tenant record
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane.smith@example.com",
    "phone": "+1987654321",
    "lease_start_date": "2025-09-01",
    "lease_end_date": "2026-08-31",
    "security_deposit": 3400,
    "apartment_id": 2
  }
  ```
- **Response** (201 Created):
  ```json
  {
    "id": 43,
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane.smith@example.com",
    "phone": "+1987654321",
    "lease_start_date": "2025-09-01T00:00:00Z",
    "lease_end_date": "2026-08-31T00:00:00Z",
    "security_deposit": 3400,
    "is_active": true,
    "apartment_id": 2,
    "created_at": "2025-08-22T11:20:45Z",
    "updated_at": "2025-08-22T11:20:45Z"
  }
  ```

### Update Tenant

- **URL**: `PATCH /tenants/:id`
- **Description**: Updates an existing tenant's details
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "email": "jane.smith.updated@example.com",
    "phone": "+1987654322"
  }
  ```
- **Response**:
  ```json
  {
    "id": 43,
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane.smith.updated@example.com",
    "phone": "+1987654322",
    "lease_start_date": "2025-09-01T00:00:00Z",
    "lease_end_date": "2026-08-31T00:00:00Z",
    "security_deposit": 3400,
    "is_active": true,
    "apartment_id": 2,
    "created_at": "2025-08-22T11:20:45Z",
    "updated_at": "2025-08-22T12:05:10Z"
  }
  ```

### Archive Tenant

- **URL**: `POST /tenants/:id/archive`
- **Description**: Archives a tenant (marks as inactive)
- **Auth Required**: Yes
- **Response**:
  ```json
  {
    "id": 43,
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane.smith.updated@example.com",
    "phone": "+1987654322",
    "lease_start_date": "2025-09-01T00:00:00Z",
    "lease_end_date": "2026-08-31T00:00:00Z",
    "security_deposit": 3400,
    "is_active": false,
    "apartment_id": 2,
    "created_at": "2025-08-22T11:20:45Z",
    "updated_at": "2025-08-22T13:45:30Z"
  }
  ```

### Update Bill Preferences

- **URL**: `PATCH /tenants/:id/bill-preferences`
- **Description**: Updates a tenant's bill preferences
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "include_water": true,
    "include_electricity": false,
    "include_gas": true,
    "include_internet": true,
    "include_trash": true,
    "bill_day": 5
  }
  ```
- **Response**: Updated tenant object

### Preview Tenant Closure

- **URL**: `POST /tenants/:id/closure-preview`
- **Description**: Calculates what the final balance would be if tenant were to leave now
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "estimated_deductions": 250.75,
    "deduction_reason": "Wall repairs and deep cleaning"
  }
  ```
- **Response**:
  ```json
  {
    "tenant_id": 42,
    "tenant_name": "John Doe",
    "security_deposit": 3000,
    "estimated_deductions": 250.75,
    "deduction_reason": "Wall repairs and deep cleaning",
    "advance_payment": 500,
    "outstanding_balance": 1200.5,
    "final_balance_due": 700.5,
    "potential_refund": 1749.25,
    "preview_date": "2025-08-22T14:30:00Z",
    "is_preview": true
  }
  ```

### Process Tenant Closure

- **URL**: `POST /tenants/:id/closure`
- **Description**: Processes tenant checkout, handles security deposit and marks tenant as inactive
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "deposit_deductions": 250.75,
    "deduction_reason": "Wall repairs and deep cleaning"
  }
  ```
- **Response**:
  ```json
  {
    "tenant_id": 42,
    "tenant_name": "John Doe",
    "security_deposit": 3000,
    "deposit_deductions": 250.75,
    "deduction_reason": "Wall repairs and deep cleaning",
    "advance_payment": 500,
    "outstanding_balance": 1200.5,
    "final_balance_due": 700.5,
    "refund_amount": 1749.25,
    "closure_date": "2025-08-22T14:35:22Z",
    "is_preview": false
  }
  ```

### Delete Tenant

- **URL**: `DELETE /tenants/:id`
- **Description**: Permanently removes a tenant from the system
- **Auth Required**: Yes
- **Response** (200 OK):
  ```json
  {
    "message": "Tenant deleted successfully"
  }
  ```

## Bills

### Get All Bills

- **URL**: `GET /bills`
- **Description**: Retrieves a list of all bills
- **Auth Required**: Yes
- **Query Parameters**:
  - `month` (optional): Filter by month (1-12)
  - `year` (optional): Filter by year
  - `tenantId` (optional): Filter by tenant ID
  - `isPaid` (optional): Filter by payment status (true/false)
- **Response**:
  ```json
  [
    {
      "id": 123,
      "month": 8,
      "year": 2025,
      "rent": 1500,
      "water_bill": 45.75,
      "electricity_bill": 85.5,
      "gas_bill": 35.25,
      "internet_bill": 60,
      "trash_bill": 25,
      "service_charge": 100,
      "other_charges": 0,
      "previous_balance": 0,
      "advance_payment": 0,
      "total_amount": 1851.5,
      "is_paid": false,
      "due_date": "2025-08-05T00:00:00Z",
      "tenant_id": 42,
      "apartment_id": 1
    }
    // More bills...
  ]
  ```

### Get Bill by ID

- **URL**: `GET /bills/:id`
- **Description**: Retrieves details of a specific bill
- **Auth Required**: Yes
- **Response**: Single bill object as shown above
- **Error Response** (404 Not Found):
  ```json
  {
    "statusCode": 404,
    "message": "Bill not found",
    "error": "Not Found"
  }
  ```

### Create Bill

- **URL**: `POST /bills`
- **Description**: Creates a new bill
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "month": 9,
    "year": 2025,
    "rent": 1800,
    "water_bill": 48.25,
    "electricity_bill": 92.75,
    "gas_bill": 40.5,
    "internet_bill": 60,
    "trash_bill": 25,
    "service_charge": 100,
    "due_date": "2025-09-05",
    "tenant_id": 43,
    "apartment_id": 2
  }
  ```
- **Response** (201 Created): Created bill object

### Update Bill

- **URL**: `PATCH /bills/:id`
- **Description**: Updates an existing bill
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "water_bill": 52.3,
    "electricity_bill": 95.4
  }
  ```
- **Response**: Updated bill object

### Mark Bill as Paid

- **URL**: `POST /bills/:id/paid`
- **Description**: Marks a bill as paid
- **Auth Required**: Yes
- **Response**:
  ```json
  {
    "id": 123,
    "is_paid": true,
    "updated_at": "2025-08-22T15:10:45Z"
    // ... other bill properties
  }
  ```

### Delete Bill

- **URL**: `DELETE /bills/:id`
- **Description**: Removes a bill from the system
- **Auth Required**: Yes
- **Response** (200 OK):
  ```json
  {
    "message": "Bill deleted successfully"
  }
  ```

## Payments

### Get All Payments

- **URL**: `GET /payments`
- **Description**: Retrieves a list of all payments
- **Auth Required**: Yes
- **Query Parameters**:
  - `startDate` (optional): Filter by start date (YYYY-MM-DD)
  - `endDate` (optional): Filter by end date (YYYY-MM-DD)
  - `tenantId` (optional): Filter by tenant ID
- **Response**:
  ```json
  [
    {
      "id": 56,
      "amount": 1851.5,
      "date": "2025-08-03T14:30:00Z",
      "description": "August rent payment",
      "payment_method": "Credit Card",
      "reference_number": "TRX123456789",
      "tenant_id": 42,
      "created_at": "2025-08-03T14:30:00Z",
      "updated_at": "2025-08-03T14:30:00Z"
    }
    // More payments...
  ]
  ```

### Get Payment by ID

- **URL**: `GET /payments/:id`
- **Description**: Retrieves details of a specific payment
- **Auth Required**: Yes
- **Response**: Single payment object as shown above

### Get Tenant Total Payments

- **URL**: `GET /payments/tenant/:tenantId/total`
- **Description**: Retrieves the total amount paid by a tenant
- **Auth Required**: Yes
- **Response**:
  ```json
  {
    "tenant_id": 42,
    "tenant_name": "John Doe",
    "total_paid": 12560.75
  }
  ```

### Get Tenant Payment History

- **URL**: `GET /payments/tenant/:tenantId/history`
- **Description**: Retrieves payment history for a tenant
- **Auth Required**: Yes
- **Response**:
  ```json
  [
    {
      "id": 56,
      "amount": 1851.5,
      "date": "2025-08-03T14:30:00Z",
      "description": "August rent payment",
      "payment_method": "Credit Card",
      "reference_number": "TRX123456789",
      "tenant_id": 42,
      "created_at": "2025-08-03T14:30:00Z",
      "updated_at": "2025-08-03T14:30:00Z"
    }
    // More payment history...
  ]
  ```

### Get Monthly Payment Summary

- **URL**: `GET /payments/summary/monthly`
- **Description**: Retrieves monthly payment summaries
- **Auth Required**: Yes
- **Query Parameters**:
  - `year` (optional): Filter by year
- **Response**:
  ```json
  [
    {
      "month": 1,
      "year": 2025,
      "total_amount": 15680.25,
      "payment_count": 12
    },
    {
      "month": 2,
      "year": 2025,
      "total_amount": 16240.75,
      "payment_count": 14
    }
    // More monthly summaries...
  ]
  ```

### Create Payment

- **URL**: `POST /payments`
- **Description**: Records a new payment
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "amount": 1851.5,
    "date": "2025-08-03",
    "description": "August rent payment",
    "payment_method": "Credit Card",
    "reference_number": "TRX123456789",
    "tenant_id": 42
  }
  ```
- **Response** (201 Created): Created payment object

### Update Payment

- **URL**: `PATCH /payments/:id`
- **Description**: Updates an existing payment record
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "payment_method": "Bank Transfer",
    "reference_number": "BTR987654321"
  }
  ```
- **Response**: Updated payment object

### Delete Payment

- **URL**: `DELETE /payments/:id`
- **Description**: Removes a payment record from the system
- **Auth Required**: Yes
- **Response** (200 OK):
  ```json
  {
    "message": "Payment deleted successfully"
  }
  ```

## Dashboard

### Get Financial Summary

- **URL**: `GET /dashboard/financial-summary`
- **Description**: Retrieves financial summary for a specific month
- **Auth Required**: Yes
- **Query Parameters**:
  - `year` (optional): Year for the financial summary (defaults to current year)
  - `month` (optional): Month for the financial summary (1-12, defaults to current month)
- **Response**:
  ```json
  {
    "year": 2025,
    "month": 8,
    "total_expected": 25420.5,
    "total_collected": 22890.75,
    "collection_rate": 90.05,
    "total_outstanding": 2529.75,
    "tenant_counts": {
      "total": 15,
      "fully_paid": 12,
      "partially_paid": 2,
      "unpaid": 1
    },
    "payment_methods_breakdown": [
      { "method": "Bank Transfer", "count": 7, "amount": 12540.25 },
      { "method": "Credit Card", "count": 5, "amount": 10350.5 }
    ]
  }
  ```

### Get Tenant Statuses

- **URL**: `GET /dashboard/tenant-statuses`
- **Description**: Retrieves payment status for all tenants in a specific month
- **Auth Required**: Yes
- **Query Parameters**:
  - `year` (optional): Year for tenant statuses (defaults to current year)
  - `month` (optional): Month for tenant statuses (1-12, defaults to current month)
- **Response**:
  ```json
  [
    {
      "tenant_id": 42,
      "tenant_name": "John Doe",
      "apartment_number": "101",
      "bill_amount": 1851.5,
      "paid_amount": 1851.5,
      "payment_status": "fully_paid",
      "payment_date": "2025-08-03T14:30:00Z",
      "due_date": "2025-08-05T00:00:00Z",
      "days_overdue": 0
    },
    {
      "tenant_id": 43,
      "tenant_name": "Jane Smith",
      "apartment_number": "202",
      "bill_amount": 2166.5,
      "paid_amount": 1000.0,
      "payment_status": "partially_paid",
      "payment_date": "2025-08-04T11:15:00Z",
      "due_date": "2025-08-05T00:00:00Z",
      "days_overdue": 0
    }
    // More tenant statuses...
  ]
  ```

### Get Yearly Summary

- **URL**: `GET /dashboard/yearly-summary`
- **Description**: Retrieves yearly financial summary with month-by-month breakdown
- **Auth Required**: Yes
- **Query Parameters**:
  - `year` (optional): Year for the summary (defaults to current year)
- **Response**:
  ```json
  {
    "year": 2025,
    "total_collected": 270840.5,
    "monthly_breakdown": [
      {
        "month": 1,
        "expected": 24850.75,
        "collected": 24100.25,
        "collection_rate": 96.98
      },
      {
        "month": 2,
        "expected": 24850.75,
        "collected": 24350.5,
        "collection_rate": 97.99
      }
      // More monthly data...
    ],
    "occupancy_rate": 92.5,
    "yearly_trends": {
      "average_collection_rate": 95.4,
      "highest_month": "April",
      "lowest_month": "December"
    }
  }
  ```

## Reports

### Generate Monthly Report PDF

- **URL**: `GET /reports/monthly/:year/:month`
- **Description**: Creates a PDF report for a specific month and year
- **Auth Required**: Yes
- **Response**: PDF file download with a content type of `application/pdf`

### Generate Monthly Report PDF (Query Parameters)

- **URL**: `GET /reports/monthly-pdf`
- **Description**: Creates a PDF report using query parameters for month and year
- **Auth Required**: Yes
- **Query Parameters**:
  - `year` (required): Year for the report
  - `month` (required): Month for the report (1-12)
- **Response**: PDF file download with a content type of `application/pdf`

### Generate Tenant Report

- **URL**: `GET /reports/tenant/:id`
- **Description**: Creates a PDF report for a specific tenant within a date range
- **Auth Required**: Yes
- **Query Parameters**:
  - `startDate` (required): Start date (YYYY-MM-DD)
  - `endDate` (required): End date (YYYY-MM-DD)
- **Response**: PDF file download with a content type of `application/pdf`

### Generate Tenant Statement

- **URL**: `GET /reports/tenant/:id/statement`
- **Description**: Creates a comprehensive statement PDF for a tenant showing payment history and bills
- **Auth Required**: Yes
- **Query Parameters**:
  - `startDate` (required): Start date (YYYY-MM-DD)
  - `endDate` (required): End date (YYYY-MM-DD)
- **Response**: PDF file download with a content type of `application/pdf`

## Notes and Special Logic

### Carry-forward Logic

The system uses a "running month" billing model:

- Full month's rent is charged regardless of move-in/out date within the month
- Unpaid balances carry forward automatically to the next month's bill
- Advance payments are credited to future bills

### Authentication Security

- All endpoints (except login) require a valid JWT token in the Authorization header
- Tokens expire after a predefined period (default is 1 hour)
- Use the format: `Authorization: Bearer <token>`
