# Software Requirements Specification

> **Last Updated**: September 12, 2025
>
> **Document Type**: Requirements
>
> **Status**: Current (SRS)

## For Nocillax Rent App

**Version 1.0**

Prepared by: Nocillax Development Team  
Date: September 7, 2025

---

## Table of Contents

1. [Introduction](#1-introduction)

   1. [Purpose](#11-purpose)
   2. [Scope](#12-scope)
   3. [Definitions, Acronyms, and Abbreviations](#13-definitions-acronyms-and-abbreviations)
   4. [References](#14-references)
   5. [Overview](#15-overview)

2. [Overall Description](#2-overall-description)

   1. [Product Perspective](#21-product-perspective)
   2. [Product Functions](#22-product-functions)
   3. [User Classes and Characteristics](#23-user-classes-and-characteristics)
   4. [Operating Environment](#24-operating-environment)
   5. [Design and Implementation Constraints](#25-design-and-implementation-constraints)
   6. [Assumptions and Dependencies](#26-assumptions-and-dependencies)

3. [Specific Requirements](#3-specific-requirements)

   1. [Functional Requirements](#31-functional-requirements)
      1. [Authentication and Authorization](#311-authentication-and-authorization)
      2. [Apartment Management](#312-apartment-management)
      3. [Tenant Management](#313-tenant-management)
      4. [Billing Management](#314-billing-management)
      5. [Payment Processing](#315-payment-processing)
      6. [Dashboard and Reporting](#316-dashboard-and-reporting)
   2. [Non-Functional Requirements](#32-non-functional-requirements)
      1. [Performance](#321-performance)
      2. [Security](#322-security)
      3. [Usability](#323-usability)
      4. [Reliability](#324-reliability)
      5. [Maintainability](#325-maintainability)
      6. [Portability](#326-portability)
   3. [User Interface Requirements](#33-user-interface-requirements)
   4. [Hardware and Software Interfaces](#34-hardware-and-software-interfaces)
   5. [System Features](#35-system-features)
   6. [Database Requirements](#36-database-requirements)

4. [Appendices](#4-appendices)
   1. [Glossary](#41-glossary)
   2. [References](#42-references)
   3. [Sample Data](#43-sample-data)

---

## 1. Introduction

### 1.1 Purpose

This document provides a detailed specification of the requirements for the Nocillax Rent App, a comprehensive rental property management system. It outlines the functional and non-functional requirements, constraints, and system interfaces required for the successful development and implementation of the application.

The intended audience for this document includes:

- Software developers implementing the system
- Quality assurance testers validating the implementation
- Project managers overseeing the development process
- Stakeholders who will be using or maintaining the system

### 1.2 Scope

The Nocillax Rent App is an administrative tool designed to streamline and automate the management of rental properties, tenants, billing, and payment tracking. The system aims to replace manual record-keeping processes with a comprehensive digital solution.

**The system will include:**

- Secure admin authentication
- Apartment/property management
- Tenant information management
- Automated monthly billing
- Payment recording and tracking
- Financial reporting and analytics
- PDF report generation

**The system will not include:**

- Tenant-facing portal (admin-only access)
- Direct payment processing (payments are recorded, not processed)
- Property maintenance scheduling
- Legal document generation beyond basic reports

### 1.3 Definitions, Acronyms, and Abbreviations

| Term/Acronym  | Definition                                                                                      |
| ------------- | ----------------------------------------------------------------------------------------------- |
| API           | Application Programming Interface                                                               |
| SRS           | Software Requirements Specification                                                             |
| UI            | User Interface                                                                                  |
| JWT           | JSON Web Token                                                                                  |
| CRUD          | Create, Read, Update, Delete                                                                    |
| REST          | Representational State Transfer                                                                 |
| SSR           | Server-Side Rendering                                                                           |
| PDF           | Portable Document Format                                                                        |
| Admin         | The property manager/administrator who uses the system                                          |
| Tenant        | Individual who rents a property unit                                                            |
| Bill          | Monthly invoice generated for a tenant                                                          |
| Running Month | Billing model where tenants are billed for the entire month regardless of move-in/move-out date |

### 1.4 References

1. IEEE Standard 830-1998: IEEE Recommended Practice for Software Requirements Specifications
2. Nocillax Rent App Project Charter (internal document)
3. NestJS Official Documentation: https://docs.nestjs.com/
4. Next.js Official Documentation: https://nextjs.org/docs
5. PostgreSQL Documentation: https://www.postgresql.org/docs/

### 1.5 Overview

The remainder of this document is organized as follows:

- Section 2 provides an overall description of the system, including product perspective, functions, user characteristics, constraints, and assumptions.
- Section 3 presents specific requirements categorized as functional, non-functional, interface, and system requirements.
- Section 4 contains appendices with supplementary information such as a glossary, references, and sample data.

## 2. Overall Description

### 2.1 Product Perspective

The Nocillax Rent App is a standalone web-based application designed to be used by property managers/administrators. It is not part of a larger system but may interface with external email services for notification purposes.

The application follows a three-tier architecture:

1. **Presentation Layer**: Next.js frontend for the user interface
2. **Application Layer**: NestJS backend for business logic and API endpoints
3. **Data Layer**: PostgreSQL database for persistent storage

**System Context Diagram**:

```
┌─────────────┐     HTTP/HTTPS     ┌─────────────┐      SQL       ┌─────────────┐
│             │<------------------>│             │<-------------->│             │
│  Next.js    │                    │   NestJS    │                │ PostgreSQL  │
│  Frontend   │     REST API       │   Backend   │                │  Database   │
│             │                    │             │                │             │
└─────────────┘                    └─────────────┘                └─────────────┘
       ^                                  ^
       │                                  │
       v                                  v
┌─────────────┐                    ┌─────────────┐
│             │                    │             │
│    Admin    │                    │   Email     │
│    User     │                    │   Service   │
│             │                    │             │
└─────────────┘                    └─────────────┘
```

### 2.2 Product Functions

The major functions of the Nocillax Rent App include:

1. **Authentication and Access Control**

   - Secure admin login
   - Session management with JWT

2. **Apartment Management**

   - Add, edit, and delete apartment/property information
   - Track apartment status (vacant, occupied, maintenance)
   - Associate apartments with tenants

3. **Tenant Management**

   - Create and maintain tenant profiles with contact information
   - Track lease agreements, security deposits, and advance payments
   - Manage tenant onboarding and checkout processes

4. **Billing System**

   - Automated monthly bill generation based on the running month model
   - Customizable bill components (rent, utilities, other charges)
   - Carry forward unpaid balances to the next billing cycle

5. **Payment Processing**

   - Record and track tenant payments
   - Calculate remaining balances after payments
   - Handle excess payments as advance payments for future bills

6. **Financial Dashboard and Reporting**
   - Real-time financial overview with key metrics
   - Generate monthly statements and tenant payment histories
   - Produce PDF reports for accounting purposes

### 2.3 User Classes and Characteristics

The system has one primary user class:

**Administrator/Property Manager**:

- Responsible for managing all aspects of rental properties
- Has complete access to all system functions
- Technical proficiency may vary but is expected to have basic computer skills
- Frequency of use: Daily or weekly for regular management tasks
- Primary objectives: Efficient property management, accurate financial tracking, and reduced administrative burden

### 2.4 Operating Environment

The system will operate in the following environment:

- **Client-side**:

  - Modern web browsers (Chrome, Firefox, Safari, Edge - latest versions plus one previous version)
  - Desktop and mobile devices with varying screen sizes (minimum supported width: 375px)
  - Internet connection with minimum 1 Mbps speed

- **Server-side**:

  - Linux-based hosting environment
  - Node.js runtime (v18.x or later)
  - PostgreSQL database (v15 or later)
  - 1GB RAM minimum for the application server
  - 10GB storage minimum for application and database

- **Network**:
  - HTTPS protocol for all communications
  - RESTful API between frontend and backend
  - Firewall protection for database access

### 2.5 Design and Implementation Constraints

The following constraints influence the design and implementation:

1. **Technological Constraints**:

   - Frontend: Next.js framework with React and Tailwind CSS
   - Backend: NestJS framework with TypeScript
   - Database: PostgreSQL
   - Authentication: JWT-based authentication

2. **Regulatory Constraints**:

   - Must comply with data protection and privacy regulations
   - Secure storage of personal tenant information
   - Proper audit trail for financial transactions

3. **Hardware Limitations**:

   - The application should run efficiently on modest server specifications
   - Mobile responsiveness required down to 375px screen width

4. **Standards Compliance**:
   - REST API design principles
   - TypeScript coding standards
   - Automated testing with minimum 80% code coverage

### 2.6 Assumptions and Dependencies

#### Assumptions:

1. The admin has continuous access to a modern web browser and internet connection
2. The system will manage a single property or multiple properties from a single administrative account
3. The admin is the sole user of the system (no multi-user access requirements)
4. All financial calculations are based on a calendar month billing cycle
5. Tenant payments are recorded manually after they are received through external payment methods

#### Dependencies:

1. Availability of a PostgreSQL database server
2. Node.js runtime environment for both frontend and backend
3. Email service provider for notifications (if implemented)
4. PDF generation libraries compatibility with the chosen server environment

## 3. Specific Requirements

### 3.1 Functional Requirements

#### 3.1.1 Authentication and Authorization

**FR-1.1**: Admin Authentication

- The system shall provide a secure login mechanism for administrators using email/username and password
- The system shall generate a JWT token upon successful authentication
- The system shall validate the JWT token for each subsequent API request
- The system shall include an automatic logout after 8 hours of inactivity

**FR-1.2**: Session Management

- The system shall maintain session information for authenticated users
- The system shall allow admins to manually log out of the system
- The system shall protect all application routes and API endpoints from unauthorized access

#### 3.1.2 Apartment Management

**FR-2.1**: Apartment CRUD Operations

- The system shall allow admins to create new apartment entries with details including:
  - Unit number or identifier
  - Floor number
  - Size (in square feet)
  - Monthly rent amount
  - Security deposit amount
  - Features (e.g., balcony, air conditioning)
- The system shall allow viewing a list of all apartments with filtering and sorting options
- The system shall allow editing existing apartment information
- The system shall allow marking apartments as inactive without deletion for historical record keeping

**FR-2.2**: Apartment Status Management

- The system shall track apartment status as one of: vacant, occupied, maintenance, or reserved
- The system shall automatically update apartment status when a tenant is assigned or removed
- The system shall allow manual status updates for maintenance or reserved conditions

**FR-2.3**: Apartment-Tenant Association

- The system shall associate a tenant with exactly one apartment
- The system shall prevent assigning multiple tenants to the same apartment
- The system shall maintain a history of tenant occupancy for each apartment

#### 3.1.3 Tenant Management

**FR-3.1**: Tenant Profile Management

- The system shall allow creating tenant profiles with:
  - Full name
  - Contact information (email, phone)
  - Emergency contact
  - National ID or other identification
  - Photo (optional)
  - Lease agreement details
  - Security deposit amount
- The system shall allow viewing, editing, and deactivating tenant profiles
- The system shall track tenant status (active, former)

**FR-3.2**: Lease Agreement Tracking

- The system shall store lease start and end dates
- The system shall track security deposit amounts and payment status
- The system shall maintain records of lease renewals or modifications

**FR-3.3**: Tenant Onboarding

- The system shall support a tenant onboarding process including:
  - Assigning an apartment
  - Recording security deposit
  - Setting up initial billing parameters
  - Generating first month's bill

**FR-3.4**: Tenant Checkout

- The system shall support a tenant checkout process including:
  - Final bill calculation
  - Security deposit refund calculation with deductions
  - Advance payment refund calculation
  - Updating apartment status to vacant
  - Archiving tenant record for historical purposes

#### 3.1.4 Billing Management

**FR-4.1**: Automated Monthly Billing

- The system shall automatically generate bills for all active tenants on the first day of each month
- The system shall include configurable bill components:
  - Monthly rent
  - Utility charges (water, electricity, gas)
  - Maintenance fees
  - Other custom charges
- The system shall carry forward any unpaid balance from previous months

**FR-4.2**: Bill Customization

- The system shall allow admins to enable or disable specific bill components for individual tenants
- The system shall allow adding custom, one-time charges to any bill
- The system shall allow manual editing of any bill component before finalization

**FR-4.3**: Bill Status Tracking

- The system shall track bill status as: unpaid, partially paid, or fully paid
- The system shall automatically update bill status when payments are recorded

**FR-4.4**: Running Month Model Implementation

- The system shall implement a "running month" billing model where:
  - Tenants are billed for the entire month regardless of move-in/move-out date
  - No proration is applied for partial month occupancy
  - Tenants are responsible for the full month's bill even when moving out mid-month

#### 3.1.5 Payment Processing

**FR-5.1**: Payment Recording

- The system shall allow recording of tenant payments with details:
  - Payment amount
  - Payment date
  - Payment method (cash, bank transfer, check, etc.)
  - Reference number (optional)
  - Description or notes
- The system shall associate payments with specific tenants
- The system shall calculate the remaining balance after each payment

**FR-5.2**: Advance Payment Handling

- The system shall detect when a payment exceeds the current outstanding balance
- The system shall automatically store excess payment amounts as advance payments
- The system shall apply advance payments to future bills

**FR-5.3**: Payment History

- The system shall maintain a complete history of all payments for each tenant
- The system shall allow searching and filtering payment records by date, amount, or tenant

**FR-5.4**: Payment Analysis

- The system shall calculate collection rates (percentage of expected payments received)
- The system shall identify late or missing payments
- The system shall track payment trends over time

#### 3.1.6 Dashboard and Reporting

**FR-6.1**: Financial Dashboard

- The system shall provide a real-time dashboard showing:
  - Total expected revenue for the current month
  - Total collected revenue for the current month
  - Collection rate percentage
  - Number of vacant and occupied units
  - List of tenants with outstanding balances

**FR-6.2**: Tenant Payment Status

- The system shall display a summary of tenant payment statuses for the current month
- The system shall categorize tenants as: paid in full, partially paid, or unpaid
- The system shall highlight overdue payments with the number of days overdue

**FR-6.3**: Report Generation

- The system shall generate PDF reports including:
  - Monthly financial statements with tenant payment details
  - Individual tenant statements with payment history
  - Yearly financial summaries
  - Occupancy rate reports

**FR-6.4**: Data Export

- The system shall allow exporting financial data in common formats (CSV, Excel)
- The system shall allow printing of reports directly from the browser

### 3.2 Non-Functional Requirements

#### 3.2.1 Performance

**NFR-1.1**: Response Time

- The system shall respond to user interactions within 1.5 seconds under normal load
- Dashboard and data retrieval API calls shall complete within 1.5 seconds
- The PDF generation process shall not exceed 10 seconds for reports with 20+ tenants

**NFR-1.2**: Throughput

- The system shall support at least 100 API requests per minute
- The system shall handle database transactions for at least 50 concurrent users

**NFR-1.3**: Capacity

- The system shall support management of up to 500 apartment units
- The system shall maintain records for up to 2,000 current and former tenants
- The system shall store at least 5 years of payment and billing history

#### 3.2.2 Security

**NFR-2.1**: Authentication Security

- The system shall store passwords using bcrypt or similar secure hashing algorithm
- The system shall enforce password complexity requirements (minimum 8 characters, mix of letters, numbers, and symbols)
- The system shall implement rate limiting to prevent brute force attacks

**NFR-2.2**: Data Protection

- The system shall encrypt sensitive data at rest in the database
- The system shall use HTTPS for all client-server communications
- The system shall implement proper input validation to prevent SQL injection and XSS attacks

**NFR-2.3**: Audit Trail

- The system shall maintain an audit log of significant actions (login attempts, payment records, bill modifications)
- The system shall include timestamp and user information with each logged action

#### 3.2.3 Usability

**NFR-3.1**: User Interface Design

- The system shall have a clean, minimalist, and consistent design
- The system shall follow established UI patterns and conventions
- The system shall provide clear feedback for all user actions

**NFR-3.2**: Responsiveness

- The system shall be fully responsive for screens from 375px width and larger
- The system shall adapt layouts for optimal viewing on desktop, tablet, and mobile devices

**NFR-3.3**: Accessibility

- The system shall maintain WCAG 2.1 AA compliance for core functionality
- The system shall support keyboard navigation for all main features
- The system shall maintain sufficient color contrast for text readability

#### 3.2.4 Reliability

**NFR-4.1**: Availability

- The system shall be available 99.9% of the time, excluding scheduled maintenance
- The system shall handle database connection failures gracefully with appropriate error messages

**NFR-4.2**: Error Handling

- The system shall provide clear, user-friendly error messages
- The system shall log detailed error information for troubleshooting
- The system shall validate all input data before processing

**NFR-4.3**: Data Integrity

- The system shall ensure database transactions maintain ACID properties
- The system shall implement appropriate database constraints to prevent data corruption
- The system shall include data validation at both frontend and backend

#### 3.2.5 Maintainability

**NFR-5.1**: Code Structure

- The system shall follow a modular architecture to facilitate maintenance
- The system shall adhere to established coding standards for TypeScript and JavaScript
- The system shall include comprehensive inline code documentation

**NFR-5.2**: Testing

- The system shall have unit test coverage of at least 80% for core business logic
- The system shall include integration tests for critical user flows
- The system shall support automated testing of API endpoints

**NFR-5.3**: Versioning

- The system shall implement API versioning to allow for future updates
- The system shall maintain backwards compatibility for at least one previous API version

#### 3.2.6 Portability

**NFR-6.1**: Browser Compatibility

- The system shall function correctly on the latest versions of Chrome, Firefox, Safari, and Edge browsers
- The system shall support at least one previous version of these browsers

**NFR-6.2**: Installation

- The system shall be deployable via Docker containers
- The system shall provide clear installation documentation
- The system shall minimize external dependencies to reduce installation complexity

### 3.3 User Interface Requirements

**UI-1**: Dashboard Interface

- The dashboard shall display key financial metrics prominently
- The dashboard shall include visualizations (charts, graphs) for financial data
- The dashboard shall provide quick navigation links to frequently used functions

**UI-2**: Apartment Management Interface

- The apartment list view shall display key information in a tabular format
- The apartment detail view shall organize information in logical sections
- The apartment creation/edit form shall include validation feedback

**UI-3**: Tenant Management Interface

- The tenant list shall include search and filter capabilities
- The tenant detail view shall include tabs for personal information, billing history, and payment history
- The tenant creation/edit form shall include file upload for documents and photos

**UI-4**: Billing Interface

- The bill creation interface shall include itemized entries with automatic totaling
- The bill list view shall use color coding to indicate payment status
- The bill detail view shall show payment history related to the specific bill

**UI-5**: Payment Interface

- The payment recording form shall include auto-calculation of remaining balance
- The payment history view shall include sorting and filtering options
- The payment receipt shall be printable with a professional layout

**UI-6**: Reporting Interface

- The report generation interface shall include date range selection
- The report preview shall display before final generation
- The generated reports shall have consistent, professional formatting

### 3.4 Hardware and Software Interfaces

**HSI-1**: Client Hardware Requirements

- The system shall function on desktop computers, laptops, tablets, and smartphones
- The system shall require minimum screen resolution of 375px width
- The system shall support standard input devices (keyboard, mouse, touchscreen)

**HSI-2**: Client Software Requirements

- The system shall require a modern web browser (Chrome, Firefox, Safari, Edge - latest version plus one previous version)
- The system shall require JavaScript to be enabled
- The system shall require cookies to be enabled for authentication persistence

**HSI-3**: Server Hardware Requirements

- The system shall run on a server with minimum 1GB RAM
- The system shall require minimum 10GB storage for application and database
- The system shall support vertical scaling for increased load

**HSI-4**: Server Software Requirements

- The system shall require Node.js runtime (v18.x or later)
- The system shall require PostgreSQL database (v15 or later)
- The system shall require Linux-based operating system

**HSI-5**: Network Requirements

- The system shall communicate over HTTPS
- The system shall function with minimum 1 Mbps internet connection
- The system shall implement appropriate firewall rules for database protection

**HSI-6**: External System Interfaces

- The system shall integrate with email service providers for notifications
- The system shall support PDF generation and download

### 3.5 System Features

**SF-1**: Multi-property Support

- The system shall allow management of multiple properties/buildings
- The system shall organize apartments by property/building
- The system shall enable financial reporting by individual property or consolidated

**SF-2**: Data Backup and Recovery

- The system shall perform automated daily database backups
- The system shall retain backups for at least 30 days
- The system shall include a recovery procedure for data restoration

**SF-3**: Tenant Communication

- The system shall generate tenant notices for upcoming rent due dates
- The system shall maintain a log of communications with tenants
- The system shall allow customization of tenant-facing documents

### 3.6 Database Requirements

**DB-1**: Database Schema

- The database shall implement the following primary entities:
  - Apartments
  - Tenants
  - Bills
  - Payments
  - Admin Users
  - Reports

**DB-2**: Data Relationships

- One-to-Many relationship between Apartments and Tenants (historical)
- One-to-One relationship between current Tenant and Apartment
- One-to-Many relationship between Tenants and Bills
- One-to-Many relationship between Tenants and Payments
- Many-to-One relationship between Bills and Payments

**DB-3**: Data Persistence

- The database shall maintain historical records of all transactions
- The database shall archive rather than delete sensitive information
- The database shall maintain referential integrity across all relationships

**DB-4**: Data Migration

- The system shall include tools for data import from CSV or Excel
- The system shall support database schema migrations for version updates

## 4. Appendices

### 4.1 Glossary

| Term             | Definition                                                                        |
| ---------------- | --------------------------------------------------------------------------------- |
| Advance Payment  | Payment amount exceeding the current bill that is applied to future bills         |
| Bill             | Monthly invoice generated for a tenant containing rent and other charges          |
| Collection Rate  | Percentage of expected rent that has been collected                               |
| Dashboard        | Main administrative interface showing financial and property overview             |
| JWT              | JSON Web Token, used for secure authentication                                    |
| Payment          | Record of money received from a tenant                                            |
| Running Month    | Billing model where tenants pay for entire months regardless of partial occupancy |
| Security Deposit | Refundable amount collected at lease start, returned at checkout minus deductions |
| Tenant           | Person renting an apartment unit                                                  |

### 4.2 References

1. IEEE Standard 830-1998: IEEE Recommended Practice for Software Requirements Specifications
2. Nocillax Rent App Project Charter
3. NestJS Documentation: https://docs.nestjs.com/
4. Next.js Documentation: https://nextjs.org/docs
5. PostgreSQL Documentation: https://www.postgresql.org/docs/

### 4.3 Sample Data

#### Sample Apartment Data:

```json
{
  "id": 1,
  "number": "101A",
  "floor": 1,
  "size_sqft": 750,
  "rent_amount": 1200.0,
  "security_deposit_amount": 2400.0,
  "status": "occupied",
  "features": ["balcony", "central AC", "new flooring"],
  "created_at": "2025-01-15T08:30:00Z",
  "updated_at": "2025-06-22T14:15:00Z"
}
```

#### Sample Tenant Data:

```json
{
  "id": 42,
  "name": "John Smith",
  "email": "john.smith@example.com",
  "phone": "555-123-4567",
  "emergency_contact": "Mary Smith, 555-765-4321",
  "national_id": "AB12345678",
  "photo_url": "/uploads/tenants/john-smith.jpg",
  "lease_start": "2025-02-01",
  "lease_end": "2026-01-31",
  "apartment_id": 1,
  "security_deposit": 2400.0,
  "advance_payment": 0.0,
  "status": "active",
  "created_at": "2025-01-25T10:00:00Z",
  "updated_at": "2025-01-25T10:00:00Z"
}
```

#### Sample Bill Data:

```json
{
  "id": 155,
  "tenant_id": 42,
  "month": 9,
  "year": 2025,
  "bill_date": "2025-09-01",
  "due_date": "2025-09-30",
  "items": [
    {
      "description": "Monthly Rent",
      "amount": 1200.0
    },
    {
      "description": "Water Bill",
      "amount": 45.0
    },
    {
      "description": "Gas Bill",
      "amount": 30.0
    },
    {
      "description": "Internet",
      "amount": 75.0
    }
  ],
  "subtotal": 1350.0,
  "tax": 0.0,
  "total": 1350.0,
  "amount_paid": 1000.0,
  "balance": 350.0,
  "status": "partially_paid",
  "created_at": "2025-09-01T00:01:00Z",
  "updated_at": "2025-09-10T14:30:00Z"
}
```

#### Sample Payment Data:

```json
{
  "id": 78,
  "tenant_id": 42,
  "amount": 1000.0,
  "payment_method": "Cash",
  "date": "2025-09-10",
  "reference_number": "PMT-10092025-42",
  "description": "Partial rent payment",
  "remaining_balance": 350.0,
  "created_at": "2025-09-10T14:30:00Z"
}
```
