# Nocillax Rent App

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

## Comprehensive Rental Management Application

A full-featured property management system designed to streamline apartment rentals, tenant management, billing, and payment processing. Perfect for property managers and landlords who need a complete solution for managing their rental properties.

## Table of Contents

- [Features](#features)
- [Development Status](#development-status)
- [System Architecture](#system-architecture)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Database Setup](#database-setup)
- [Core Business Model](#core-business-model)
- [API Documentation](#api-documentation)
- [Module Overview](#module-overview)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Apartment Management**: Track units, features, availability, and rental rates
- **Tenant Management**: Store tenant details, documents, and lease information
- **Billing System**: Automated monthly bill generation with customizable charges
- **Payment Processing**: Record and track payments with remaining balance calculation
- **Financial Dashboard**: Real-time overview of income, outstanding balances, and financial metrics
- **Reporting**: Generate financial reports, payment histories, and tenant statements
- **User Authentication**: Secure admin login with JWT authentication
- **Responsive UI**: Modern interface that works across devices

## Development Status

### Current Status: Backend Complete, Frontend Development Starting

| Component                | Status         | Completion % | Notes                                           |
| ------------------------ | -------------- | ------------ | ----------------------------------------------- |
| **Backend API**          | ✅ Complete    | 100%         | All endpoints implemented and tested            |
| **Database Models**      | ✅ Complete    | 100%         | All entities and relationships defined          |
| **Backend Testing**      | ✅ Complete    | 100%         | 90.32% statement coverage, 306 tests passing    |
| **Frontend Components**  | 🟡 In Progress | 20%          | Basic components created, pages being developed |
| **Frontend Integration** | 🟡 In Progress | 15%          | API service integration started                 |
| **Frontend Testing**     | 🔴 Not Started | 0%           | Will begin after core components are complete   |
| **Deployment**           | 🔴 Not Started | 0%           | Will begin after MVP is complete                |

### Recent Milestones

- ✅ Completed comprehensive backend testing (306 tests passing)
- ✅ Achieved over 90% test coverage across the backend
- ✅ Finalized all API endpoints with proper documentation
- ✅ Implemented advanced billing and payment processing logic
- ✅ Added PDF report generation for tenant statements and financial reports

### Next Steps

1. **Frontend Development (Current Focus)**

   - Implement responsive UI components using Next.js and Tailwind CSS
   - Create tenant, billing, and payment management interfaces
   - Build dashboard with financial visualizations
   - Integrate authentication flow with backend

2. **Testing & QA**

   - Implement frontend component and integration tests
   - Perform cross-browser compatibility testing
   - Conduct user acceptance testing with stakeholders

3. **Deployment**
   - Set up CI/CD pipeline for automated testing and deployment
   - Configure production environment with proper security measures
   - Create backup and monitoring systems

## System Architecture

### Frontend

- **Framework**: Next.js 14 (React)
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **API Integration**: Axios
- **Charts & Visualization**: Chart.js

### Backend

- **Framework**: NestJS
- **Database ORM**: TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **API**: RESTful endpoints
- **Validation**: Class-validator and DTOs
- **PDF Generation**: PDFKit for report generation

### Database

- **Primary Database**: PostgreSQL
- **Schema Management**: TypeORM migrations

## Installation

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- PostgreSQL (v15 or later)
- Docker and Docker Compose (optional, for containerized setup)

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env file with your database credentials

# Run database migrations
npm run migration:run

# Start the development server
npm run start:dev
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env file with your backend API URL

# Start the development server
npm run dev
```

### Database Setup

The application uses PostgreSQL. You can set it up locally or use Docker:

```bash
# Using Docker Compose in the backend directory
cd backend
docker-compose up -d
```

## Core Business Model

### Running Month Billing

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

## API Documentation

The API follows RESTful conventions with the following main endpoints:

### Authentication

- `POST /auth/login` - Admin login to get JWT token

### Apartments

- `GET /apartments` - List all apartments
- `GET /apartments/:id` - Get apartment details
- `POST /apartments` - Create new apartment
- `PATCH /apartments/:id` - Update apartment
- `DELETE /apartments/:id` - Delete apartment

### Tenants

- `GET /tenants` - List all tenants
- `GET /tenants/:id` - Get tenant details
- `POST /tenants` - Create new tenant
- `PATCH /tenants/:id` - Update tenant
- `DELETE /tenants/:id` - Delete tenant
- `GET /tenants/:id/payment-history` - Get tenant payment history

### Bills

- `GET /bills` - List all bills
- `GET /bills/:id` - Get bill details
- `POST /bills` - Create new bill
- `PATCH /bills/:id` - Update bill
- `DELETE /bills/:id` - Delete bill
- `POST /bills/generate` - Generate monthly bills

### Payments

- `GET /payments` - List all payments
- `GET /payments/:id` - Get payment details
- `POST /payments` - Create new payment
- `PATCH /payments/:id` - Update payment
- `DELETE /payments/:id` - Delete payment

### Dashboard

- `GET /dashboard/financial-summary` - Get financial dashboard data
- `GET /dashboard/tenant-statuses` - Get tenant payment status overview
- `GET /dashboard/yearly-summary/:year` - Get yearly financial summary

### Reports

- `GET /reports/monthly-statement/:year/:month` - Generate monthly statement PDF
- `GET /reports/tenant/:tenantId` - Generate tenant statement PDF

## Module Overview

### Apartments Module

Manages apartment information including number, features, rent amount, and status.

### Tenants Module

Handles tenant records including personal information, lease terms, security deposit, and payment history.

### Bills Module

Manages regular monthly bills and other charges. Includes automatic bill generation functionality.

### Payments Module

Records tenant payments with calculation of remaining balances and advance payment tracking.

### Dashboard Module

Provides real-time financial insights and tenant payment statuses for administrative overview.

### Reports Module

Generates PDF reports for monthly statements and tenant payment histories.

### Auth Module

Handles admin authentication and security using JWT tokens.

## Testing

The application includes comprehensive test coverage, with the backend having 90.32% statement coverage and 306 passing tests:

```bash
# Run backend tests
cd backend
npm test

# Run backend tests with coverage report
cd backend
npm run test:cov

# Run frontend tests (in development)
cd frontend
npm test
```

### Backend Test Coverage Summary

| Metric     | Coverage % |
| ---------- | ---------- |
| Statements | 90.32%     |
| Branches   | 83.57%     |
| Functions  | 86.94%     |
| Lines      | 91.26%     |

For detailed test coverage information, see [Unit-Test-Coverage.md](./Unit-Test-Coverage.md).

## Deployment

### Backend Deployment

```bash
cd backend
npm run build
npm run start:prod
```

### Frontend Deployment

```bash
cd frontend
npm run build
npm start
```

### Docker Deployment

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
