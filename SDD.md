# Software Design Document (SDD)

## For Nocillax Rent App

**Version 1.0**

Prepared by: Nocillax Development Team  
Date: September 7, 2025

---

## Table of Contents

1. [Introduction](#1-introduction)

   1. [Purpose](#11-purpose)
   2. [Scope](#12-scope)
   3. [References](#13-references)
   4. [Definitions and Acronyms](#14-definitions-and-acronyms)

2. [System Overview](#2-system-overview)

   1. [System Context](#21-system-context)
   2. [Major Components](#22-major-components)

3. [Architectural Design (HLD)](#3-architectural-design-hld)

   1. [Architecture Style and Rationale](#31-architecture-style-and-rationale)
   2. [Logical Components](#32-logical-components)
   3. [Deployment View](#33-deployment-view)
   4. [Cross-Cutting Concerns](#34-cross-cutting-concerns)

4. [Detailed Design (LLD)](#4-detailed-design-lld)

   1. [Module Descriptions](#41-module-descriptions)
   2. [Data Structures and Database Schema](#42-data-structures-and-database-schema)
   3. [API Contracts](#43-api-contracts)
   4. [Sequence and Flow Diagrams](#44-sequence-and-flow-diagrams)
   5. [Algorithms and Pseudocode](#45-algorithms-and-pseudocode)

5. [Constraints and Assumptions](#5-constraints-and-assumptions)

   1. [Design Constraints](#51-design-constraints)
   2. [Technical Assumptions](#52-technical-assumptions)

6. [Appendices](#6-appendices)
   1. [Code Structure](#61-code-structure)
   2. [Technology Stack Justification](#62-technology-stack-justification)
   3. [Security Considerations](#63-security-considerations)

---

## 1. Introduction

### 1.1 Purpose

This Software Design Document (SDD) provides a comprehensive architectural and detailed design description for the Nocillax Rent App. It translates the requirements specified in the SRS into a structure that can be implemented in code. This document is intended for developers, architects, and technical stakeholders involved in building the system.

The SDD serves the following purposes:

- Define the high-level architecture and component structure
- Detail the low-level design for each module
- Specify interfaces between components
- Document data structures and database schema
- Provide a blueprint for implementation

### 1.2 Scope

This document covers the design of the Nocillax Rent App, a web-based application for property management, tenant tracking, billing, and payment management. It encompasses both the backend NestJS application and the frontend Next.js application, detailing how they interact through the API layer.

Specifically, this document addresses:

- System architecture and component design
- Database schema and entity relationships
- API design and contracts
- Module interactions and dependencies
- Security implementation
- Deployment architecture

### 1.3 References

1. IEEE 1016-2009: IEEE Standard for Information Technology—Systems Design—Software Design Descriptions
2. Nocillax Rent App Software Requirements Specification (SRS)
3. NestJS Official Documentation: https://docs.nestjs.com/
4. Next.js Official Documentation: https://nextjs.org/docs
5. TypeORM Documentation: https://typeorm.io/
6. PostgreSQL Documentation: https://www.postgresql.org/docs/

### 1.4 Definitions and Acronyms

| Term/Acronym | Definition                                                                                           |
| ------------ | ---------------------------------------------------------------------------------------------------- |
| API          | Application Programming Interface                                                                    |
| SDD          | Software Design Document                                                                             |
| HLD          | High-Level Design                                                                                    |
| LLD          | Low-Level Design                                                                                     |
| JWT          | JSON Web Token                                                                                       |
| REST         | Representational State Transfer                                                                      |
| SOLID        | Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, Dependency Inversion |
| DI           | Dependency Injection                                                                                 |
| ORM          | Object-Relational Mapping                                                                            |
| SSR          | Server-Side Rendering                                                                                |
| TypeORM      | Object-Relational Mapping library for TypeScript                                                     |
| DTO          | Data Transfer Object                                                                                 |

## 2. System Overview

### 2.1 System Context

The Nocillax Rent App operates as a standalone web-based property management system with one primary user role: the administrator. The system interfaces with the PostgreSQL database for data persistence and potentially with an email service for notifications.

**System Context Diagram**:

```
                    ┌──────────────────────────────────────────────────┐
                    │                Nocillax Rent App                 │
                    │                                                  │
                    │  ┌───────────┐   REST API    ┌───────────┐       │
                    │  │           │<------------->│           │       │
                    │  │  Next.js  │               │  NestJS   │       │
                    │  │ Frontend  │               │  Backend  │       │
                    │  │           │               │           │       │
                    │  └───────────┘               └─────┬─────┘       │
                    │        ^                           │             │
                    └────────┼───────────────────────────┼─────────────┘
                             │                           │
                    ┌────────┴────────┐       ┌──────────┴─────────┐
                    │                 │       │                    │
                    │  Administrator  │       │     PostgreSQL     │
                    │                 │       │     Database       │
                    │                 │       │                    │
                    └─────────────────┘       └────────────────────┘
```

The application is fully web-based, requiring only a modern browser to access. The system does not depend on any external systems except for optional email notifications.

### 2.2 Major Components

The system consists of the following major components:

1. **Frontend Application**

   - Next.js web application providing the user interface
   - Client-side state management
   - Form handling and validation
   - Data visualization (charts/graphs)
   - PDF rendering

2. **Backend API Server**

   - NestJS REST API implementation
   - Business logic implementation
   - Authentication and authorization
   - Data access layer (TypeORM)
   - PDF generation

3. **Database**

   - PostgreSQL relational database
   - Entity relationships and constraints
   - Indexes for performance optimization
   - Data persistence

4. **Cross-Cutting Components**
   - Authentication and security
   - Logging and monitoring
   - Configuration management
   - Error handling

## 3. Architectural Design (HLD)

### 3.1 Architecture Style and Rationale

The Nocillax Rent App follows a modern web application architecture combining multiple architectural patterns:

**Three-Tier Architecture**
The system is structured into three distinct tiers:

1. **Presentation Tier**: Next.js frontend application
2. **Application Tier**: NestJS backend API
3. **Data Tier**: PostgreSQL database

**Rationale**: This separation provides clear boundaries between concerns, allows independent scaling of components, and promotes maintainability.

**RESTful Architecture**
The communication between frontend and backend follows REST principles with standardized HTTP methods and status codes.

**Rationale**: REST provides a stateless, cacheable, and uniform interface that aligns well with web applications and supports the decoupled nature of the system.

**Modular Architecture**
Both frontend and backend are organized into feature modules with clear boundaries and responsibilities.

**Rationale**: Modular architecture supports separation of concerns, testability, and maintainability. It allows different developers to work on different modules simultaneously.

**Dependency Injection**
The NestJS backend leverages dependency injection for service composition and testability.

**Rationale**: DI reduces coupling between components, facilitates testing through mocking, and supports the SOLID principles.

### 3.2 Logical Components

#### 3.2.1 Frontend Logical Components

The frontend is structured using the Next.js App Router architecture:

```
frontend/
├── public/            # Static assets
├── src/
│   ├── app/           # Application routes and pages
│   │   ├── dashboard/ # Dashboard routes
│   │   ├── apartments/ # Apartment management routes
│   │   ├── tenants/   # Tenant management routes
│   │   ├── bills/     # Billing management routes
│   │   ├── payments/  # Payment management routes
│   │   ├── reports/   # Report generation routes
│   │   └── auth/      # Authentication routes
│   ├── components/    # Reusable UI components
│   │   ├── ui/        # Basic UI elements
│   │   ├── forms/     # Form components
│   │   ├── tables/    # Table components
│   │   └── charts/    # Data visualization components
│   ├── lib/           # Utility functions and helpers
│   │   ├── api.ts     # API client
│   │   ├── auth.ts    # Authentication utilities
│   │   └── utils.ts   # General utilities
│   └── types/         # TypeScript type definitions
└── ...
```

#### 3.2.2 Backend Logical Components

The backend follows NestJS's module-based architecture:

```
backend/
├── src/
│   ├── main.ts                # Application entry point
│   ├── app.module.ts          # Root application module
│   ├── app.controller.ts      # Root controller
│   ├── app.service.ts         # Root service
│   ├── auth/                  # Authentication module
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── jwt.strategy.ts
│   ├── apartments/            # Apartment management module
│   │   ├── apartments.module.ts
│   │   ├── apartments.controller.ts
│   │   └── apartments.service.ts
│   ├── tenants/               # Tenant management module
│   │   ├── tenants.module.ts
│   │   ├── tenants.controller.ts
│   │   └── tenants.service.ts
│   ├── bills/                 # Billing module
│   │   ├── bills.module.ts
│   │   ├── bills.controller.ts
│   │   ├── bills.service.ts
│   │   └── bill-generation.service.ts
│   ├── payments/              # Payment module
│   │   ├── payments.module.ts
│   │   ├── payments.controller.ts
│   │   └── payments.service.ts
│   ├── reports/               # Reporting module
│   │   ├── reports.module.ts
│   │   ├── reports.controller.ts
│   │   ├── reports.service.ts
│   │   └── reports.generator.ts
│   ├── dashboard/             # Dashboard module
│   │   ├── dashboard.module.ts
│   │   ├── dashboard.controller.ts
│   │   └── dashboard.service.ts
│   ├── entities/              # TypeORM entity definitions
│   │   ├── apartment.entity.ts
│   │   ├── tenant.entity.ts
│   │   ├── bill.entity.ts
│   │   ├── payment.entity.ts
│   │   └── other-charge.entity.ts
│   └── dto/                   # Data Transfer Objects
│       ├── apartment/
│       ├── tenant/
│       ├── bill/
│       ├── payment/
│       ├── auth/
│       ├── reports/
│       └── dashboard/
└── ...
```

### 3.3 Deployment View

#### 3.3.1 Deployment Architecture

The system uses a containerized deployment approach with Docker:

```
┌─────────────────────────────────────────────────┐
│                Docker Environment                │
│                                                 │
│  ┌─────────────┐   ┌─────────────┐  ┌────────┐  │
│  │             │   │             │  │        │  │
│  │  Next.js    │   │   NestJS    │  │Postgres│  │
│  │  Frontend   │   │   Backend   │  │   DB   │  │
│  │  Container  │   │  Container  │  │Container  │
│  │             │   │             │  │        │  │
│  └─────────────┘   └─────────────┘  └────────┘  │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### 3.3.2 Infrastructure Requirements

- **Frontend Container**:

  - Node.js runtime
  - 512MB RAM minimum
  - Exposed port: 3000

- **Backend Container**:

  - Node.js runtime
  - 1GB RAM minimum
  - Exposed port: 4000

- **Database Container**:

  - PostgreSQL
  - 1GB RAM minimum
  - Persistent volume mount for data

- **Networking**:
  - Internal Docker network for container communication
  - HTTPS termination at reverse proxy level
  - Database not exposed to external network

### 3.4 Cross-Cutting Concerns

#### 3.4.1 Authentication and Authorization

- JWT-based authentication
- Token generation on successful login
- Token validation middleware for protected routes
- Role-based authorization (admin only in current version)
- Token refresh mechanism

#### 3.4.2 API Versioning

- API routes prefixed with version (e.g., `/api/v1/`)
- Backward compatibility maintained for at least one previous version
- Deprecation notices for outdated endpoints

#### 3.4.3 Validation

- Request validation using class-validator for DTOs
- Consistent error responses for validation failures
- Frontend form validation mirroring backend validation rules

#### 3.4.4 Error Handling

- Centralized error handling with appropriate HTTP status codes
- Detailed error logging for server-side issues
- User-friendly error messages for client-side display
- Graceful degradation for non-critical failures

#### 3.4.5 Logging and Monitoring

- Structured logging with Winston
- Different log levels (debug, info, warn, error)
- Request/response logging for API endpoints
- Performance metrics collection

## 4. Detailed Design (LLD)

### 4.1 Module Descriptions

#### 4.1.1 Authentication Module

**Purpose**: Handle user authentication and authorization.

**Key Components**:

- `AuthModule`: Configures JWT strategy and exports authentication services
- `AuthController`: Exposes login endpoint
- `AuthService`: Validates credentials and generates JWT tokens
- `JwtStrategy`: Implements Passport JWT strategy for token validation
- `JwtAuthGuard`: Protects routes requiring authentication

**Primary Interfaces**:

```typescript
// Auth Service Interface
interface IAuthService {
  validateUser(username: string, password: string): Promise<any>;
  login(user: any): Promise<{ access_token: string }>;
}

// Login DTO
class LoginDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
```

#### 4.1.2 Apartment Module

**Purpose**: Manage apartment information and status.

**Key Components**:

- `ApartmentModule`: Configures dependencies and exports apartment services
- `ApartmentController`: Exposes CRUD endpoints for apartments
- `ApartmentService`: Implements apartment business logic
- `Apartment`: Entity representing an apartment

**Primary Interfaces**:

```typescript
// Apartment Service Interface
interface IApartmentService {
  findAll(): Promise<Apartment[]>;
  findOne(id: number): Promise<Apartment>;
  create(createApartmentDto: CreateApartmentDto): Promise<Apartment>;
  update(
    id: number,
    updateApartmentDto: UpdateApartmentDto
  ): Promise<Apartment>;
  remove(id: number): Promise<boolean>;
  changeStatus(id: number, status: ApartmentStatus): Promise<Apartment>;
}

// Apartment Entity
class Apartment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: string;

  @Column()
  floor: number;

  @Column({ type: "decimal" })
  rent_amount: number;

  @Column({ type: "decimal" })
  security_deposit_amount: number;

  @Column({
    type: "enum",
    enum: ["vacant", "occupied", "maintenance", "reserved"],
    default: "vacant",
  })
  status: string;

  @Column("simple-json", { nullable: true })
  features: string[];

  @Column({ nullable: true })
  size_sqft: number;

  @OneToMany(() => Tenant, (tenant) => tenant.apartment)
  tenants: Tenant[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
```

#### 4.1.3 Tenant Module

**Purpose**: Manage tenant information, onboarding, and checkout.

**Key Components**:

- `TenantModule`: Configures dependencies and exports tenant services
- `TenantController`: Exposes CRUD and specialized endpoints for tenants
- `TenantService`: Implements tenant business logic
- `Tenant`: Entity representing a tenant

**Primary Interfaces**:

```typescript
// Tenant Service Interface
interface ITenantService {
  findAll(): Promise<Tenant[]>;
  findArchived(): Promise<Tenant[]>;
  findOne(id: number): Promise<Tenant>;
  create(createTenantDto: CreateTenantDto): Promise<Tenant>;
  update(id: number, updateTenantDto: UpdateTenantDto): Promise<Tenant>;
  archive(id: number): Promise<Tenant>;
  processCheckout(
    id: number,
    checkoutDto: CheckoutDto
  ): Promise<CheckoutResult>;
  getTenantPaymentHistory(id: number): Promise<PaymentHistory[]>;
}
```

#### 4.1.4 Bill Module

**Purpose**: Generate and manage bills for tenants.

**Key Components**:

- `BillModule`: Configures dependencies and exports bill services
- `BillController`: Exposes CRUD and specialized endpoints for bills
- `BillService`: Implements bill management business logic
- `BillGenerationService`: Specialized service for automatic bill generation
- `Bill`: Entity representing a bill

**Primary Interfaces**:

```typescript
// Bill Service Interface
interface IBillService {
  findAll(): Promise<Bill[]>;
  findByTenant(tenantId: number): Promise<Bill[]>;
  findOne(id: number): Promise<Bill>;
  create(createBillDto: CreateBillDto): Promise<Bill>;
  update(id: number, updateBillDto: UpdateBillDto): Promise<Bill>;
  remove(id: number): Promise<boolean>;
  addBillItem(id: number, billItemDto: BillItemDto): Promise<Bill>;
  updateStatus(id: number, paymentAmount: number): Promise<Bill>;
}

// Bill Generation Service Interface
interface IBillGenerationService {
  generateMonthlyBills(): Promise<Bill[]>;
  generateBillForTenant(tenantId: number): Promise<Bill>;
}
```

#### 4.1.5 Payment Module

**Purpose**: Record and manage tenant payments.

**Key Components**:

- `PaymentModule`: Configures dependencies and exports payment services
- `PaymentController`: Exposes CRUD and specialized endpoints for payments
- `PaymentService`: Implements payment business logic
- `Payment`: Entity representing a payment

**Primary Interfaces**:

```typescript
// Payment Service Interface
interface IPaymentService {
  findAll(
    tenantId?: number,
    startDate?: Date,
    endDate?: Date
  ): Promise<Payment[]>;
  findOne(id: number): Promise<Payment>;
  create(createPaymentDto: CreatePaymentDto): Promise<Payment>;
  update(id: number, updatePaymentDto: UpdatePaymentDto): Promise<Payment>;
  remove(id: number): Promise<boolean>;
  getTotalPaymentsByTenantId(tenantId: number): Promise<number>;
  getMonthlyPaymentSummary(year: number, month: number): Promise<any[]>;
  getTenantPaymentHistory(tenantId: number): Promise<any[]>;
}
```

#### 4.1.6 Report Module

**Purpose**: Generate PDF reports and financial analyses.

**Key Components**:

- `ReportModule`: Configures dependencies and exports report services
- `ReportController`: Exposes endpoints for report generation
- `ReportService`: Implements report business logic
- `ReportGenerator`: Specialized service for PDF creation

**Primary Interfaces**:

```typescript
// Report Service Interface
interface IReportService {
  generateMonthlyStatement(year: number, month: number): Promise<Buffer>;
  generateTenantStatement(tenantId: number): Promise<Buffer>;
  getYearlySummary(year: number): Promise<YearlySummary>;
}
```

#### 4.1.7 Dashboard Module

**Purpose**: Provide aggregated data for dashboard display.

**Key Components**:

- `DashboardModule`: Configures dependencies and exports dashboard services
- `DashboardController`: Exposes endpoints for dashboard data
- `DashboardService`: Implements dashboard data aggregation logic

**Primary Interfaces**:

```typescript
// Dashboard Service Interface
interface IDashboardService {
  getFinancialSummary(): Promise<FinancialSummary>;
  getTenantStatuses(): Promise<TenantStatusSummary>;
  getYearlySummary(year: number): Promise<YearlyFinancialData>;
}
```

### 4.2 Data Structures and Database Schema

#### 4.2.1 Entity Relationship Diagram

```
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│   Apartment   │       │    Tenant     │       │     Bill      │
├───────────────┤       ├───────────────┤       ├───────────────┤
│ id            │<──┐   │ id            │<──┐   │ id            │
│ number        │   │   │ name          │   │   │ tenant_id     │
│ floor         │   │   │ email         │   │   │ month         │
│ rent_amount   │   │   │ phone         │   │   │ year          │
│ security_amt  │   │   │ emergency_contact │   │ bill_date     │
│ status        │   │   │ national_id   │   │   │ due_date      │
│ features      │   │   │ photo_url     │   │   │ total         │
│ size_sqft     │   │   │ lease_start   │   │   │ status        │
│ created_at    │   │   │ lease_end     │   │   │ created_at    │
│ updated_at    │   │   │ apartment_id  │───┘   │ updated_at    │
└───────────────┘   │   │ security_deposit │    └───────┬───────┘
                    │   │ advance_payment  │            │
                    │   │ status        │              │
                    │   │ created_at    │              │
                    │   │ updated_at    │              │
                    │   └───────────────┘              │
                    │           │                      │
                    │           │                      │
                    │           ▼                      │
                    │   ┌───────────────┐              │
                    │   │    Payment    │              │
                    │   ├───────────────┤              │
                    │   │ id            │              │
                    │   │ tenant_id     │──────────────┘
                    │   │ amount        │
                    │   │ payment_date  │
                    │   │ payment_method│
                    │   │ reference_num │
                    │   │ description   │
                    │   │ remaining_bal │
                    │   │ created_at    │
                    │   └───────────────┘
```

#### 4.2.2 Database Tables

1. **apartments**

   - `id`: SERIAL PRIMARY KEY
   - `number`: VARCHAR(50) NOT NULL
   - `floor`: INT
   - `rent_amount`: DECIMAL(10,2) NOT NULL
   - `security_deposit_amount`: DECIMAL(10,2) NOT NULL
   - `status`: ENUM('vacant', 'occupied', 'maintenance', 'reserved') DEFAULT 'vacant'
   - `features`: JSONB
   - `size_sqft`: INT
   - `created_at`: TIMESTAMP NOT NULL DEFAULT NOW()
   - `updated_at`: TIMESTAMP NOT NULL DEFAULT NOW()

2. **tenants**

   - `id`: SERIAL PRIMARY KEY
   - `name`: VARCHAR(100) NOT NULL
   - `email`: VARCHAR(100)
   - `phone`: VARCHAR(50) NOT NULL
   - `emergency_contact`: VARCHAR(200)
   - `national_id`: VARCHAR(50) UNIQUE
   - `photo_url`: VARCHAR(255)
   - `lease_start`: DATE NOT NULL
   - `lease_end`: DATE NOT NULL
   - `apartment_id`: INT REFERENCES apartments(id)
   - `security_deposit`: DECIMAL(10,2) NOT NULL
   - `advance_payment`: DECIMAL(10,2) DEFAULT 0.0
   - `status`: ENUM('active', 'former') DEFAULT 'active'
   - `created_at`: TIMESTAMP NOT NULL DEFAULT NOW()
   - `updated_at`: TIMESTAMP NOT NULL DEFAULT NOW()

3. **bills**

   - `id`: SERIAL PRIMARY KEY
   - `tenant_id`: INT NOT NULL REFERENCES tenants(id)
   - `month`: INT NOT NULL
   - `year`: INT NOT NULL
   - `bill_date`: DATE NOT NULL
   - `due_date`: DATE NOT NULL
   - `subtotal`: DECIMAL(10,2) NOT NULL
   - `tax`: DECIMAL(10,2) DEFAULT 0.0
   - `total`: DECIMAL(10,2) NOT NULL
   - `amount_paid`: DECIMAL(10,2) DEFAULT 0.0
   - `balance`: DECIMAL(10,2)
   - `status`: ENUM('unpaid', 'partially_paid', 'paid') DEFAULT 'unpaid'
   - `created_at`: TIMESTAMP NOT NULL DEFAULT NOW()
   - `updated_at`: TIMESTAMP NOT NULL DEFAULT NOW()

4. **bill_items**

   - `id`: SERIAL PRIMARY KEY
   - `bill_id`: INT NOT NULL REFERENCES bills(id)
   - `description`: VARCHAR(100) NOT NULL
   - `amount`: DECIMAL(10,2) NOT NULL

5. **payments**

   - `id`: SERIAL PRIMARY KEY
   - `tenant_id`: INT NOT NULL REFERENCES tenants(id)
   - `bill_id`: INT REFERENCES bills(id)
   - `amount`: DECIMAL(10,2) NOT NULL
   - `payment_date`: DATE NOT NULL
   - `payment_method`: VARCHAR(50) NOT NULL
   - `reference_number`: VARCHAR(100)
   - `description`: TEXT
   - `remaining_balance`: DECIMAL(10,2) NOT NULL
   - `created_at`: TIMESTAMP NOT NULL DEFAULT NOW()
   - `updated_at`: TIMESTAMP NOT NULL DEFAULT NOW()

6. **tenant_history**

   - `id`: SERIAL PRIMARY KEY
   - `tenant_id`: INT NOT NULL REFERENCES tenants(id)
   - `apartment_id`: INT NOT NULL REFERENCES apartments(id)
   - `start_date`: DATE NOT NULL
   - `end_date`: DATE
   - `created_at`: TIMESTAMP NOT NULL DEFAULT NOW()

7. **admin_users**
   - `id`: SERIAL PRIMARY KEY
   - `username`: VARCHAR(50) NOT NULL UNIQUE
   - `password_hash`: VARCHAR(255) NOT NULL
   - `name`: VARCHAR(100)
   - `created_at`: TIMESTAMP NOT NULL DEFAULT NOW()
   - `updated_at`: TIMESTAMP NOT NULL DEFAULT NOW()
   - `last_login`: TIMESTAMP

### 4.3 API Contracts

#### 4.3.1 Authentication API

| Endpoint      | Method | Request                                  | Response                                       | Description                        |
| ------------- | ------ | ---------------------------------------- | ---------------------------------------------- | ---------------------------------- |
| `/auth/login` | POST   | `{ username: string, password: string }` | `{ access_token: string, expires_in: number }` | Authenticates user and returns JWT |

#### 4.3.2 Apartment API

| Endpoint                 | Method | Request              | Response               | Description             |
| ------------------------ | ------ | -------------------- | ---------------------- | ----------------------- |
| `/apartments`            | GET    | -                    | `Array<Apartment>`     | Get all apartments      |
| `/apartments/:id`        | GET    | -                    | `Apartment`            | Get apartment by ID     |
| `/apartments`            | POST   | `CreateApartmentDto` | `Apartment`            | Create new apartment    |
| `/apartments/:id`        | PATCH  | `UpdateApartmentDto` | `Apartment`            | Update apartment        |
| `/apartments/:id`        | DELETE | -                    | `{ success: boolean }` | Delete apartment        |
| `/apartments/:id/status` | PATCH  | `{ status: string }` | `Apartment`            | Update apartment status |

#### 4.3.3 Tenant API

| Endpoint                       | Method | Request           | Response                | Description                |
| ------------------------------ | ------ | ----------------- | ----------------------- | -------------------------- |
| `/tenants`                     | GET    | -                 | `Array<Tenant>`         | Get all active tenants     |
| `/tenants/archive`             | GET    | -                 | `Array<Tenant>`         | Get archived tenants       |
| `/tenants/:id`                 | GET    | -                 | `Tenant`                | Get tenant by ID           |
| `/tenants`                     | POST   | `CreateTenantDto` | `Tenant`                | Create new tenant          |
| `/tenants/:id`                 | PATCH  | `UpdateTenantDto` | `Tenant`                | Update tenant              |
| `/tenants/:id/archive`         | POST   | -                 | `Tenant`                | Archive tenant             |
| `/tenants/:id/payment-history` | GET    | -                 | `Array<PaymentHistory>` | Get tenant payment history |
| `/tenants/:id/checkout`        | POST   | `CheckoutDto`     | `CheckoutResult`        | Process tenant checkout    |

#### 4.3.4 Bill API

| Endpoint                  | Method | Request         | Response               | Description            |
| ------------------------- | ------ | --------------- | ---------------------- | ---------------------- |
| `/bills`                  | GET    | -               | `Array<Bill>`          | Get all bills          |
| `/bills/tenant/:tenantId` | GET    | -               | `Array<Bill>`          | Get tenant bills       |
| `/bills/:id`              | GET    | -               | `Bill`                 | Get bill by ID         |
| `/bills`                  | POST   | `CreateBillDto` | `Bill`                 | Create new bill        |
| `/bills/:id`              | PATCH  | `UpdateBillDto` | `Bill`                 | Update bill            |
| `/bills/:id`              | DELETE | -               | `{ success: boolean }` | Delete bill            |
| `/bills/generate`         | POST   | -               | `Array<Bill>`          | Generate monthly bills |
| `/bills/:id/items`        | POST   | `BillItemDto`   | `Bill`                 | Add item to bill       |

#### 4.3.5 Payment API

| Endpoint                         | Method | Request            | Response                | Description                 |
| -------------------------------- | ------ | ------------------ | ----------------------- | --------------------------- |
| `/payments`                      | GET    | -                  | `Array<Payment>`        | Get all payments            |
| `/payments/:id`                  | GET    | -                  | `Payment`               | Get payment by ID           |
| `/payments`                      | POST   | `CreatePaymentDto` | `Payment`               | Record new payment          |
| `/payments/:id`                  | PATCH  | `UpdatePaymentDto` | `Payment`               | Update payment              |
| `/payments/:id`                  | DELETE | -                  | `{ success: boolean }`  | Delete payment              |
| `/payments/summary/:year/:month` | GET    | -                  | `MonthlyPaymentSummary` | Get monthly payment summary |

#### 4.3.6 Report API

| Endpoint                                  | Method | Request | Response        | Description                    |
| ----------------------------------------- | ------ | ------- | --------------- | ------------------------------ |
| `/reports/monthly-statement/:year/:month` | GET    | -       | PDF file        | Generate monthly statement PDF |
| `/reports/tenant/:tenantId`               | GET    | -       | PDF file        | Generate tenant statement PDF  |
| `/reports/yearly-summary/:year`           | GET    | -       | `YearlySummary` | Get yearly financial summary   |

#### 4.3.7 Dashboard API

| Endpoint                          | Method | Request | Response              | Description                        |
| --------------------------------- | ------ | ------- | --------------------- | ---------------------------------- |
| `/dashboard/financial-summary`    | GET    | -       | `FinancialSummary`    | Get financial dashboard data       |
| `/dashboard/tenant-statuses`      | GET    | -       | `TenantStatusSummary` | Get tenant payment status overview |
| `/dashboard/yearly-summary/:year` | GET    | -       | `YearlyFinancialData` | Get yearly financial summary       |

### 4.4 Sequence and Flow Diagrams

#### 4.4.1 Tenant Onboarding Flow

```
Admin                    Frontend                    Backend API                    Database
  |                         |                             |                             |
  |-- Create Tenant ------->|                             |                             |
  |                         |--- POST /tenants ---------->|                             |
  |                         |                             |-- Validate Input ---------->|
  |                         |                             |<- Validation OK ------------|
  |                         |                             |-- Check Apartment Status -->|
  |                         |                             |<- Apartment Available ------|
  |                         |                             |-- Create Tenant ----------->|
  |                         |                             |<- Tenant Created ----------|
  |                         |                             |-- Update Apartment Status ->|
  |                         |                             |<- Status Updated ----------|
  |                         |                             |-- Generate Initial Bill --->|
  |                         |                             |<- Bill Created ------------|
  |                         |<-- Tenant Created Response -|                             |
  |<- Confirmation Display -|                             |                             |
```

#### 4.4.2 Payment Processing Flow

```
Admin                    Frontend                    Backend API                    Database
  |                         |                             |                             |
  |-- Record Payment ------>|                             |                             |
  |                         |--- POST /payments --------->|                             |
  |                         |                             |-- Validate Input ---------->|
  |                         |                             |<- Validation OK ------------|
  |                         |                             |-- Get Tenant Bills -------->|
  |                         |                             |<- Bills Retrieved ----------|
  |                         |                             |-- Calculate Remaining ----->|
  |                         |                             |<- Calculation Complete -----|
  |                         |                             |-- Save Payment ------------>|
  |                         |                             |<- Payment Saved ------------|
  |                         |                             |-- Update Bill Status ------>|
  |                         |                             |<- Status Updated ----------|
  |                         |                             |-- Check Overpayment ------->|
  |                         |                             |<- Calculation Complete -----|
  |                         |                             |-- Update Advance Payment -->|
  |                         |                             |<- Update Complete ----------|
  |                         |<-- Payment Created Response-|                             |
  |<- Confirmation Display -|                             |                             |
```

#### 4.4.3 Monthly Billing Flow

```
Scheduled Task           Backend API                    Database
       |                      |                             |
       |-- Trigger Billing -->|                             |
       |                      |-- Get Active Tenants ------>|
       |                      |<- Tenants Retrieved --------|
       |                      |                             |
       |                      |-- For Each Tenant:          |
       |                      |   |                         |
       |                      |   |-- Get Previous Bills -->|
       |                      |   |<- Bills Retrieved ------|
       |                      |   |-- Calculate New Bill -->|
       |                      |   |<- Calculation Complete -|
       |                      |   |-- Save New Bill ------->|
       |                      |   |<- Bill Saved ----------|
       |                      |   |                         |
       |                      |   |-- Check Advance Payment>|
       |                      |   |<- Advance Retrieved ----|
       |                      |   |-- Apply Advance -------->|
       |                      |   |<- Advance Applied ------|
       |                      |                             |
       |<- Billing Complete --|                             |
```

### 4.5 Algorithms and Pseudocode

#### 4.5.1 Monthly Bill Generation Algorithm

```
FUNCTION generateMonthlyBills()
    currentDate = TODAY
    month = currentDate.month
    year = currentDate.year

    // Get all active tenants
    tenants = getAllActiveTenants()
    generatedBills = []

    FOR EACH tenant IN tenants
        // Create new bill
        bill = new Bill()
        bill.tenant_id = tenant.id
        bill.month = month
        bill.year = year
        bill.bill_date = currentDate
        bill.due_date = calculateDueDate(currentDate)

        // Add monthly rent
        billItems = []
        rentItem = new BillItem()
        rentItem.description = "Monthly Rent"
        rentItem.amount = tenant.apartment.rent_amount
        billItems.push(rentItem)

        // Add additional charges if enabled for tenant
        IF tenant.hasWaterBill
            waterItem = new BillItem()
            waterItem.description = "Water Bill"
            waterItem.amount = calculateWaterBill(tenant)
            billItems.push(waterItem)
        END IF

        // Calculate totals
        bill.subtotal = SUM(billItems.amount)
        bill.tax = 0
        bill.total = bill.subtotal
        bill.amount_paid = 0
        bill.balance = bill.total
        bill.status = "unpaid"

        // Save bill and items
        savedBill = saveBill(bill)
        FOR EACH item IN billItems
            item.bill_id = savedBill.id
            saveItem(item)
        END FOR

        // Apply advance payment if any
        IF tenant.advance_payment > 0
            applyAdvancePayment(savedBill, tenant)
        END IF

        generatedBills.push(savedBill)
    END FOR

    RETURN generatedBills
END FUNCTION
```

#### 4.5.2 Payment Processing Algorithm

```
FUNCTION processPayment(tenantId, amount, paymentMethod, referenceNumber, date)
    // Validate tenant exists
    tenant = getTenantById(tenantId)
    IF tenant IS NULL
        THROW Error("Tenant not found")
    END IF

    // Create payment record
    payment = new Payment()
    payment.tenant_id = tenantId
    payment.amount = amount
    payment.payment_method = paymentMethod
    payment.reference_number = referenceNumber
    payment.payment_date = date || TODAY

    // Get unpaid bills
    unpaidBills = getUnpaidBillsForTenant(tenantId)
    totalDue = SUM(unpaidBills.balance)

    // Calculate remaining balance
    remainingBalance = totalDue - amount

    // Handle overpayment
    IF remainingBalance < 0
        // Set as advance payment
        tenant.advance_payment = ABS(remainingBalance)
        updateTenant(tenant)
        remainingBalance = 0
    END IF

    payment.remaining_balance = remainingBalance
    savedPayment = savePayment(payment)

    // Update bill statuses
    remainingPayment = amount
    FOR EACH bill IN unpaidBills (ORDER BY due_date ASC)
        IF remainingPayment <= 0
            BREAK
        END IF

        IF remainingPayment >= bill.balance
            // Full payment for this bill
            bill.amount_paid += bill.balance
            bill.balance = 0
            bill.status = "paid"
            remainingPayment -= bill.balance
        ELSE
            // Partial payment
            bill.amount_paid += remainingPayment
            bill.balance -= remainingPayment
            bill.status = "partially_paid"
            remainingPayment = 0
        END IF

        updateBill(bill)
    END FOR

    RETURN savedPayment
END FUNCTION
```

#### 4.5.3 Tenant Checkout Algorithm

```
FUNCTION processTenantCheckout(tenantId, checkoutDate, deductions)
    // Get tenant record
    tenant = getTenantById(tenantId)
    IF tenant IS NULL
        THROW Error("Tenant not found")
    END IF

    // Calculate final bill if needed
    currentBills = getCurrentBillsForTenant(tenantId)
    IF currentBills.length > 0
        // Ensure bills are paid
        unpaidAmount = SUM(currentBills.balance)
        IF unpaidAmount > 0
            // Handle unpaid amount
            IF tenant.advance_payment >= unpaidAmount
                // Use advance payment to cover unpaid bills
                applyAdvancePaymentToBills(tenant, currentBills)
            ELSE
                // Mark as outstanding balance
                outstandingBalance = unpaidAmount - tenant.advance_payment
                tenant.advance_payment = 0
                updateTenant(tenant)
            END IF
        END IF
    END IF

    // Calculate security deposit refund
    securityDeposit = tenant.security_deposit
    totalDeductions = SUM(deductions.amount)
    refundAmount = securityDeposit - totalDeductions

    // Add advance payment to refund
    refundAmount += tenant.advance_payment

    // Create checkout record
    checkout = new TenantCheckout()
    checkout.tenant_id = tenantId
    checkout.checkout_date = checkoutDate
    checkout.security_deposit = securityDeposit
    checkout.deductions = deductions
    checkout.total_deductions = totalDeductions
    checkout.advance_payment_refund = tenant.advance_payment
    checkout.refund_amount = refundAmount
    saveCheckout(checkout)

    // Update apartment status
    apartment = getApartmentById(tenant.apartment_id)
    apartment.status = "vacant"
    updateApartment(apartment)

    // Update tenant status
    tenant.status = "former"
    tenant.advance_payment = 0
    updateTenant(tenant)

    // Record tenant history
    history = new TenantHistory()
    history.tenant_id = tenantId
    history.apartment_id = tenant.apartment_id
    history.start_date = tenant.lease_start
    history.end_date = checkoutDate
    saveTenantHistory(history)

    RETURN {
        tenant: tenant,
        checkout: checkout,
        refundAmount: refundAmount
    }
END FUNCTION
```

## 5. Constraints and Assumptions

### 5.1 Design Constraints

1. **Technological Constraints**

   - The system must be developed using Next.js for frontend and NestJS for backend
   - The system must use PostgreSQL as the relational database
   - The system must support containerized deployment with Docker

2. **Security Constraints**

   - All API endpoints must be secured with JWT authentication except for login
   - Passwords must be hashed using bcrypt with appropriate salt rounds
   - Sensitive data must be protected with appropriate database encryption

3. **Performance Constraints**

   - API response times must not exceed 1.5 seconds under normal load
   - PDF generation must complete within 10 seconds for reports with up to 20 tenants
   - The system must support up to 500 apartment units and 2,000 tenant records

4. **User Interface Constraints**
   - The UI must be responsive down to 375px width
   - The UI must follow a clean, minimalist design aesthetic
   - The UI must comply with WCAG 2.1 AA accessibility standards for core functionality

### 5.2 Technical Assumptions

1. **Development Assumptions**

   - Development team has expertise in TypeScript, NestJS, and Next.js
   - Modern development tools and CI/CD pipelines are available

2. **Deployment Assumptions**

   - The system will be deployed in a containerized environment
   - HTTPS termination will be handled by a reverse proxy or load balancer
   - Database backups will be managed by the hosting infrastructure

3. **User Assumptions**

   - Admin users have continuous access to modern web browsers
   - Admin users have basic computer literacy
   - The system will manage a single property or multiple properties from a single administrative account

4. **Business Assumptions**
   - Billing follows a calendar month cycle (1st to end of month)
   - Tenant payments are recorded manually after they are received
   - Financial calculations are based on the running month billing model

## 6. Appendices

### 6.1 Code Structure

#### 6.1.1 Frontend Directory Structure

```
frontend/
├── node_modules/
├── public/
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── apartments/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── tenants/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── bills/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── payments/
│   │   │   ├── page.tsx
│   │   │   └── create/
│   │   │       └── page.tsx
│   │   ├── reports/
│   │   │   └── page.tsx
│   │   ├── auth/
│   │   │   └── login/
│   │   │       └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── ...
│   │   ├── forms/
│   │   │   ├── ApartmentForm.tsx
│   │   │   ├── TenantForm.tsx
│   │   │   ├── PaymentForm.tsx
│   │   │   └── ...
│   │   ├── tables/
│   │   │   ├── ApartmentTable.tsx
│   │   │   ├── TenantTable.tsx
│   │   │   ├── BillTable.tsx
│   │   │   └── ...
│   │   ├── charts/
│   │   │   ├── FinancialSummaryChart.tsx
│   │   │   ├── OccupancyChart.tsx
│   │   │   └── ...
│   │   └── layout/
│   │       ├── Sidebar.tsx
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── utils.ts
│   ├── types/
│   │   ├── apartment.types.ts
│   │   ├── tenant.types.ts
│   │   ├── bill.types.ts
│   │   ├── payment.types.ts
│   │   └── ...
│   └── hooks/
│       ├── useAuth.ts
│       ├── useFetch.ts
│       └── ...
├── .env.local
├── .eslintrc.js
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── tsconfig.json
```

#### 6.1.2 Backend Directory Structure

```
backend/
├── node_modules/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── app.controller.ts
│   ├── app.service.ts
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── jwt.strategy.ts
│   │   ├── jwt-auth.guard.ts
│   │   └── dto/
│   │       ├── login.dto.ts
│   │       └── ...
│   ├── apartments/
│   │   ├── apartments.module.ts
│   │   ├── apartments.controller.ts
│   │   ├── apartments.service.ts
│   │   ├── apartments.controller.spec.ts
│   │   ├── apartments.service.spec.ts
│   │   └── dto/
│   │       ├── create-apartment.dto.ts
│   │       ├── update-apartment.dto.ts
│   │       └── ...
│   ├── tenants/
│   │   ├── tenants.module.ts
│   │   ├── tenants.controller.ts
│   │   ├── tenants.service.ts
│   │   ├── tenants.controller.spec.ts
│   │   ├── tenants.service.spec.ts
│   │   └── dto/
│   │       ├── create-tenant.dto.ts
│   │       ├── update-tenant.dto.ts
│   │       ├── checkout.dto.ts
│   │       └── ...
│   ├── bills/
│   │   ├── bills.module.ts
│   │   ├── bills.controller.ts
│   │   ├── bills.service.ts
│   │   ├── bill-generation.service.ts
│   │   ├── bills.controller.spec.ts
│   │   ├── bills.service.spec.ts
│   │   ├── bill-generation.service.spec.ts
│   │   └── dto/
│   │       ├── create-bill.dto.ts
│   │       ├── update-bill.dto.ts
│   │       ├── bill-item.dto.ts
│   │       └── ...
│   ├── payments/
│   │   ├── payments.module.ts
│   │   ├── payments.controller.ts
│   │   ├── payments.service.ts
│   │   ├── payments.controller.spec.ts
│   │   ├── payments.service.spec.ts
│   │   └── dto/
│   │       ├── create-payment.dto.ts
│   │       ├── update-payment.dto.ts
│   │       └── ...
│   ├── reports/
│   │   ├── reports.module.ts
│   │   ├── reports.controller.ts
│   │   ├── reports.service.ts
│   │   ├── reports.generator.ts
│   │   ├── reports.controller.spec.ts
│   │   ├── reports.service.spec.ts
│   │   ├── reports.generator.spec.ts
│   │   └── dto/
│   │       └── ...
│   ├── dashboard/
│   │   ├── dashboard.module.ts
│   │   ├── dashboard.controller.ts
│   │   ├── dashboard.service.ts
│   │   ├── dashboard.controller.spec.ts
│   │   ├── dashboard.service.spec.ts
│   │   └── dto/
│   │       └── ...
│   ├── entities/
│   │   ├── apartment.entity.ts
│   │   ├── tenant.entity.ts
│   │   ├── bill.entity.ts
│   │   ├── bill-item.entity.ts
│   │   ├── payment.entity.ts
│   │   ├── tenant-history.entity.ts
│   │   └── admin-user.entity.ts
│   ├── config/
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── app.config.ts
│   └── common/
│       ├── interceptors/
│       ├── filters/
│       ├── decorators/
│       ├── guards/
│       ├── pipes/
│       └── utils/
├── test/
│   ├── app.e2e-spec.ts
│   └── ...
├── .env
├── .eslintrc.js
├── nest-cli.json
├── package.json
├── tsconfig.json
├── tsconfig.build.json
└── docker-compose.yml
```

### 6.2 Technology Stack Justification

#### 6.2.1 Frontend: Next.js

- **Server-side rendering** improves initial page load performance and SEO
- **App Router architecture** provides a clean, organized structure for routing and layouts
- **React ecosystem** offers a wide range of components and libraries
- **TypeScript integration** ensures type safety across the application
- **Built-in API routes** facilitate backend communication
- **Incremental Static Regeneration** for efficient page updates
- **Image optimization** for better performance and user experience

#### 6.2.2 Backend: NestJS

- **Modular architecture** promotes organized code structure and separation of concerns
- **TypeScript support** ensures type safety and better tooling
- **Dependency Injection** facilitates testing and loose coupling
- **Decorators pattern** reduces boilerplate code
- **Built-in validation** using class-validator for request validation
- **OpenAPI/Swagger integration** for API documentation
- **Testing framework** for unit and integration tests

#### 6.2.3 Database: PostgreSQL

- **Relational model** aligns with the structured nature of the application data
- **Referential integrity** ensures data consistency with foreign key constraints
- **Transaction support** for complex operations (e.g., payment processing)
- **JSONB support** for flexible data structures (e.g., apartment features)
- **Full-text search** capabilities for tenant and apartment searching
- **Robust security** with row-level security and encryption options
- **Proven reliability** for business-critical applications

#### 6.2.4 ORM: TypeORM

- **TypeScript integration** for type-safe database operations
- **Entity decorators** for clean mapping between classes and database tables
- **Repository pattern** for data access abstraction
- **Migration support** for database schema evolution
- **Relationship management** for complex entity relationships
- **Query builder** for complex database queries

### 6.3 Security Considerations

#### 6.3.1 Authentication and Authorization

- **JWT-based authentication** with appropriate expiration times
- **Password hashing** using bcrypt with sufficient cost factor
- **Role-based access control** for future multi-user support
- **CSRF protection** for form submissions
- **Guard-protected routes** to prevent unauthorized access

#### 6.3.2 Data Protection

- **HTTPS enforcement** for all communications
- **Input validation** on both client and server sides
- **SQL injection prevention** through ORM and parameterized queries
- **XSS prevention** through output encoding and React's inherent protections
- **Sensitive data encryption** for personally identifiable information

#### 6.3.3 API Security

- **Rate limiting** to prevent abuse
- **Request validation** using DTOs and class-validator
- **Appropriate HTTP status codes** for different error conditions
- **Secure HTTP headers** (Content-Security-Policy, X-XSS-Protection, etc.)
- **Proper error handling** without leaking sensitive information
