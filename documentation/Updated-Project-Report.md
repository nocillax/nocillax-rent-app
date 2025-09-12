# Nocillax Rent App – Updated Project Overview

> **Last Updated**: September 12, 2025
>
> **Document Type**: Progress Report
>
> **Status**: Current

## Entity Relationships

### Apartment

- Has many Tenants (one-to-many)
- Has many Bills (one-to-many)
- Stores properties: name, address, description, base rent amount, active status, etc.

### Tenant

- Belongs to one Apartment (many-to-one)
- Has many Bills (one-to-many)
- Has many Payments (one-to-many)
- Stores personal information (name, NID), contact details (phone number), meter number, photo URL, and active status

### Bill

- Belongs to one Apartment (many-to-one)
- Belongs to one Tenant (many-to-one)
- Includes various charges: rent, water, gas, electricity, internet, service charges, other charges
- Tracks billing period (year/month) and payment status

### Payment

- Belongs to one Tenant (many-to-one)
- Records payment details: amount, date, method, reference number, description

## Backend Components

### Modules

#### AppModule

- Root module; imports and configures TypeORM with PostgreSQL
- Imports all feature modules: Apartments, Tenants, Bills, Payments, Reports, Auth

#### ApartmentsModule

- Registers ApartmentsController and ApartmentsService
- Imports TypeORM repository for Apartment, Tenant, and Bill entities

#### TenantsModule

- Registers TenantsController and TenantsService
- Imports TypeORM repository for Tenant entity
- Imports ApartmentsModule for apartment validation

#### BillsModule

- Registers BillsController and BillsService
- Imports TypeORM repository for Bill entity

#### PaymentsModule

- Registers PaymentsController and PaymentsService
- Imports TypeORM repository for Payment entity

#### ReportsModule

- Registers ReportsController, ReportsService, and ReportsGenerator
- Imports services from other modules for generating reports

#### AuthModule

- Implements JWT-based authentication with cookie support
- Registers AuthController, AuthService, and JwtStrategy
- Configures JWT token generation and validation

### Controllers

#### ApartmentsController

- CRUD endpoints for apartments:
  - GET /apartments – List all apartments
  - GET /apartments/:id – Get a specific apartment
  - POST /apartments – Create an apartment
  - PUT /apartments/:id – Update an apartment
  - DELETE /apartments/:id – Delete an apartment
- Relationship endpoints:
  - GET /apartments/:id/tenants – Get tenants of an apartment
  - GET /apartments/:id/bills – Get bills for an apartment
- Protected by JwtAuthGuard

#### TenantsController

- CRUD endpoints for tenants:
  - GET /tenants – List all tenants (with optional apartmentId filter)
  - GET /tenants/:id – Get a specific tenant
  - POST /tenants – Create a tenant
  - PATCH /tenants/:id – Update a tenant
  - DELETE /tenants/:id – Delete a tenant
- Archive functionality:
  - POST /tenants/:id/archive – Archive a tenant instead of deleting
  - GET /tenants/archive – Get archived tenants
- Relationship endpoints:
  - GET /tenants/:id/bills – Get bills for a tenant
  - GET /tenants/:id/payments – Get payments made by a tenant
- Protected by JwtAuthGuard

#### BillsController

- CRUD endpoints for bills:
  - GET /bills – List all bills
  - GET /bills/:id – Get a specific bill
  - POST /bills – Create a bill
  - PATCH /bills/:id – Update a bill
  - DELETE /bills/:id – Delete a bill
- Protected by JwtAuthGuard

#### PaymentsController

- CRUD endpoints for payments:
  - GET /payments – List all payments
  - GET /payments/:id – Get a specific payment
  - POST /payments – Create a payment
  - PATCH /payments/:id – Update a payment
  - DELETE /payments/:id – Delete a payment
- Protected by JwtAuthGuard

#### ReportsController

- Report generation endpoints:
  - GET /reports/monthly/:year/:month – Generate monthly report
  - GET /reports/tenant/:id – Generate tenant statement report
  - GET /reports/monthly-pdf – Alternative endpoint with query parameters
  - GET /reports/tenant/:id/statement – Alternative endpoint for tenant statements
- Protected by JwtAuthGuard

#### AuthController

- Authentication endpoints:
  - POST /auth/login – Log in with username and password
  - POST /auth/logout – Log out and clear cookie

### Services

#### ApartmentsService

- Handles business logic for apartment management
- Methods for CRUD operations and fetching related tenants/bills

#### TenantsService

- Handles business logic for tenant management
- Methods for CRUD operations, fetching related bills/payments, and apartment associations
- Archive functionality to soft-delete tenants

#### BillsService

- Handles business logic for bill management
- Calculate totals, mark bills as paid/unpaid

#### PaymentsService

- Handles payment management
- Associate payments with tenants, track methods and reference numbers

#### ReportsService

- Handles report generation
- Works with ReportsGenerator to produce PDF reports
- Aggregates data from multiple repositories

#### AuthService

- Handles user authentication
- Validates admin credentials and generates JWT tokens

### Special Components

#### ReportsGenerator

- Creates PDF documents using PDFKit
- Supports two main report types:
  - Monthly summary report of all bills and payments
  - Tenant-specific statement report
- Includes formatted tables, headers, and calculations

#### JwtStrategy

- Implements Passport strategy for JWT validation
- Extracts JWT from cookies or authorization header

## Frontend Structure

Next.js application with routes mirroring the backend API (In Progress):

- /dashboard – Main dashboard
- /apartments – Apartment management
- /tenants – Tenant management
- /bills – Bill management
- /payments – Payment tracking
- /reports – Report generation

TenantCard component for displaying tenant information (In Progress)

## Development Environment

- Docker Compose configuration for PostgreSQL database
- Environment configured for local development

## Completed Features

- Database Configuration: TypeORM with PostgreSQL
- Data Models: Full entity definitions and relationships
- API Structure: Complete CRUD and relationship endpoints
- PDF Reporting: Monthly and tenant-specific reports with tables, headers, and calculations
- Authentication: JWT-based authentication with cookie support
- Docker: Container setup for database

## In Progress

- Frontend Implementation: Next.js application structure created, but components are still under development
