# Nocillax Rent App - Backend

<p align="center">
  <img src="https://img.shields.io/badge/status-complete-brightgreen" alt="Status: Complete">
  <img src="https://img.shields.io/badge/coverage-90.32%25-brightgreen" alt="Test Coverage: 90.32%">
  <img src="https://img.shields.io/badge/tests-306%20passing-brightgreen" alt="Tests: 306 Passing">
  <img src="https://img.shields.io/badge/nestjs-10.x-red" alt="NestJS: 10.x">
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="License: MIT">
</p>

## Overview

This is the backend API for the Nocillax Rent App, a comprehensive property management system designed to streamline apartment rentals, tenant management, billing, and payment processing.

**Development Status**: ✅ COMPLETE

The backend development phase is now complete with all planned features implemented and thoroughly tested. The API provides a complete solution for property management with robust endpoints for apartments, tenants, billing, payments, reporting, and analytics.

## Architecture

## Core Features

- **RESTful API**: Complete API following REST principles with proper status codes and responses
- **JWT Authentication**: Secure authentication using JSON Web Tokens
- **Role-Based Access Control**: Admin-only protected routes
- **Data Validation**: Comprehensive request validation using DTOs and class-validator
- **Database Integration**: TypeORM integration with PostgreSQL
- **Automated Testing**: 306 unit tests with 90.32% statement coverage
- **Documentation**: Swagger API documentation for all endpoints
- **Error Handling**: Global exception filters with proper error responses
- **Logging**: Request logging and error tracking
- **PDF Generation**: Report generation for tenant statements and financial reports

## Tech Stack

- **Framework**: NestJS 10.x
- **Language**: TypeScript 5.x
- **ORM**: TypeORM
- **Database**: PostgreSQL
- **Testing**: Jest
- **Documentation**: Swagger/OpenAPI
- **Authentication**: Passport.js with JWT strategy
- **Validation**: class-validator and class-transformer
- **PDF Generation**: PDFKit

## API Modules

1. **Auth Module** - Authentication and authorization
2. **Apartments Module** - Apartment management and vacancy tracking
3. **Tenants Module** - Tenant information and lease management
4. **Bills Module** - Monthly bill generation and tracking
5. **Payments Module** - Payment recording and processing
6. **Dashboard Module** - Financial and occupancy analytics
7. **Reports Module** - PDF generation for statements and reports

## Project Setup

```bash
# Install dependencies
$ npm install

# Set up environment variables
$ cp .env.example .env
# Edit .env with your database credentials
```

## Running the Application

```bash
# Development mode
$ npm run start:dev

# Production mode
$ npm run build
$ npm run start:prod

# Using Docker
$ docker-compose up
```

## Running Tests

```bash
# Unit tests
$ npm run test

# Test coverage
$ npm run test:cov

# E2E tests
$ npm run test:e2e
```

## Test Coverage

The application has excellent test coverage:

| Metric     | Coverage % |
| ---------- | ---------- |
| Statements | 90.32%     |
| Branches   | 83.57%     |
| Functions  | 86.94%     |
| Lines      | 91.26%     |

For detailed test coverage information, see [Unit-Test-Coverage.md](../documentation/Unit-Test-Coverage.md).

## Database Schema

The application uses a PostgreSQL database with the following main entities:

- **Apartment** - Stores apartment unit information
- **Tenant** - Manages tenant personal and lease information
- **Bill** - Tracks monthly bills and charges
- **Payment** - Records payment transactions
- **OtherCharge** - Manages additional charges beyond rent

## Documentation

- API documentation is available via Swagger at `/api/docs` when running the application
- See [API-Documentation.md](../documentation/API-Documentation.md) for comprehensive API details
- Business logic is documented in [APPLICATION-FLOW.md](../documentation/APPLICATION-FLOW.md)

## Next Steps

With the backend fully implemented and tested, development is now focused on the frontend. See [FRONTEND-ROADMAP.md](../documentation/FRONTEND-ROADMAP.md) for details on the frontend development plan.

## License

This project is licensed under the MIT License.
