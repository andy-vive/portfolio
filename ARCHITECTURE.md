# Portfolio Project Architecture

## Table of Contents
- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Architecture Patterns](#architecture-patterns)
- [Core Components](#core-components)
- [Data Flow](#data-flow)
- [Security](#security)
- [Getting Started](#getting-started)

## Overview

This is a personal portfolio web application built with Node.js, Express, and TypeScript. It showcases projects, achievements, and professional experience with both public-facing pages and an admin panel for content management.

**Key Features:**
- Public portfolio pages (projects, achievements, skills, experience)
- Admin dashboard with authentication
- RESTful API for CRUD operations
- Server-side rendering with Pug templates
- JWT-based authentication with refresh tokens
- MySQL database with Sequelize ORM

## Technology Stack

### Backend
- **Runtime:** Node.js (ES2020)
- **Framework:** Express 5.x
- **Language:** TypeScript 5.x
- **Database:** MySQL 2.x
- **ORM:** Sequelize 6.x
- **Template Engine:** Pug 3.x

### Security & Authentication
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt
- **Security Headers:** Helmet
- **Rate Limiting:** express-rate-limit
- **CORS:** cors middleware

### Development Tools
- **TypeScript Compiler:** tsc
- **Dev Server:** nodemon + ts-node
- **Linting:** ESLint with TypeScript plugin
- **Formatting:** Prettier

## Project Structure

```
portfolio/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.ts  # Sequelize database configuration
│   │   ├── jwt.ts       # JWT configuration
│   │   ├── migrate.ts   # Database migration script
│   │   └── seed.ts      # Database seeding script
│   │
│   ├── controllers/     # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── project.controller.ts
│   │   ├── achievement.controller.ts
│   │   └── view.controller.ts
│   │
│   ├── middleware/      # Express middleware
│   │   ├── auth.middleware.ts        # JWT authentication
│   │   ├── error.middleware.ts       # Global error handler
│   │   └── validation.middleware.ts  # Request validation
│   │
│   ├── models/          # Sequelize models
│   │   ├── index.ts           # Model associations
│   │   ├── User.ts            # User model
│   │   ├── RefreshToken.ts    # Refresh token model
│   │   ├── Project.ts         # Project model
│   │   └── Achievement.ts     # Achievement model
│   │
│   ├── routes/          # Route definitions
│   │   ├── auth.routes.ts
│   │   ├── project.routes.ts
│   │   ├── achievement.routes.ts
│   │   └── view.routes.ts
│   │
│   ├── services/        # Business logic layer
│   │   ├── auth.service.ts
│   │   ├── project.service.ts
│   │   └── achievement.service.ts
│   │
│   ├── types/           # TypeScript type definitions
│   │   ├── express.d.ts         # Express type extensions
│   │   ├── project.types.ts
│   │   └── achievement.types.ts
│   │
│   ├── utils/           # Utility functions
│   │   ├── bcrypt.util.ts     # Password hashing utilities
│   │   ├── jwt.util.ts        # JWT token utilities
│   │   └── response.util.ts   # API response helpers
│   │
│   ├── validators/      # Request validation schemas
│   │   ├── auth.validator.ts
│   │   ├── project.validator.ts
│   │   └── achievement.validator.ts
│   │
│   ├── views/           # Pug templates
│   │   ├── layouts/     # Layout templates
│   │   ├── pages/       # Page templates
│   │   ├── partials/    # Reusable components
│   │   └── admin/       # Admin panel templates
│   │
│   ├── public/          # Static assets
│   │   ├── css/         # Stylesheets
│   │   ├── js/          # Client-side JavaScript
│   │   ├── images/      # Images
│   │   └── fonts/       # Fonts
│   │
│   ├── app.ts           # Express app configuration
│   └── server.ts        # Server entry point
│
├── dist/                # Compiled JavaScript output
├── .env.example         # Environment variables template
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies and scripts
```

## Architecture Patterns

### 1. Layered Architecture

The application follows a layered architecture pattern with clear separation of concerns:

```
┌─────────────────────────────────────┐
│         Routes Layer                │  Route definitions & middleware
├─────────────────────────────────────┤
│       Controllers Layer             │  Request/Response handling
├─────────────────────────────────────┤
│        Services Layer               │  Business logic
├─────────────────────────────────────┤
│         Models Layer                │  Data access & ORM
├─────────────────────────────────────┤
│         Database                    │  MySQL
└─────────────────────────────────────┘
```

**Flow:** Request → Routes → Middleware → Controllers → Services → Models → Database

### 2. MVC Pattern

- **Models:** Sequelize models ([src/models/](src/models/)) define database schema and relationships
- **Views:** Pug templates ([src/views/](src/views/)) render HTML pages
- **Controllers:** Handle HTTP requests and coordinate between services and views

### 3. Service Layer Pattern

Business logic is encapsulated in service classes ([src/services/](src/services/)), keeping controllers thin and focused on HTTP concerns.

### 4. Repository Pattern

Sequelize models act as repositories, providing data access abstraction.

## Core Components

### 1. Application Bootstrap ([src/server.ts](src/server.ts))

Entry point that:
- Tests database connection
- Starts Express server
- Handles graceful shutdown (SIGTERM/SIGINT)
- Logs available routes

### 2. Express Configuration ([src/app.ts](src/app.ts))

Configures:
- Security middleware (Helmet, CORS)
- Rate limiting (general + auth-specific)
- Body parsers (JSON, URL-encoded)
- Static file serving
- View engine (Pug)
- Route registration
- Error handling

### 3. Database Configuration ([src/config/database.ts](src/config/database.ts))

Sequelize configuration with:
- Connection pooling (max: 5, min: 0)
- Environment-based logging
- Automatic timestamp fields (createdAt, updatedAt)
- Snake_case column naming

### 4. Authentication System

**Components:**
- JWT access tokens (short-lived, 1 hour)
- Refresh tokens (long-lived, 7 days, stored in database)
- Bcrypt password hashing (10 rounds)
- Auth middleware for protected routes

**Models:**
- [User](src/models/User.ts): username, passwordHash, isActive, lastLogin
- [RefreshToken](src/models/RefreshToken.ts): token, userId, expiresAt

### 5. Domain Models

**Project** ([src/models/Project.ts](src/models/Project.ts))
- Fields: title, company, description, startDate, endDate, teamSize, role
- Array fields: responsibilities, technologies (stored as JSON)
- Has many Achievements

**Achievement** ([src/models/Achievement.ts](src/models/Achievement.ts))
- Fields: title, description, impact, metrics
- Belongs to Project (optional)

### 6. Validation System

Uses `express-validator` with custom validators for:
- Request body validation
- Query parameter validation
- Type checking and sanitization
- Custom error messages

Example: [src/validators/project.validator.ts](src/validators/project.validator.ts)

### 7. Error Handling

Centralized error handling with:
- Custom `AppError` class with status codes and error codes
- Global error middleware ([src/middleware/error.middleware.ts](src/middleware/error.middleware.ts))
- Consistent error response format

### 8. Response Utilities ([src/utils/response.util.ts](src/utils/response.util.ts))

Standardized API responses:
- `successResponse()` - Success with data
- `paginatedResponse()` - Paginated results
- `errorResponse()` - Error responses
- `unauthorizedResponse()` - 401 errors

## Data Flow

### 1. Public Page Request Flow

```
User → GET /projects
  ↓
View Routes (view.routes.ts)
  ↓
View Controller (view.controller.ts)
  ↓
Project Service (project.service.ts)
  ↓
Project Model (Project.ts)
  ↓
Database Query
  ↓
Pug Template Rendering (views/pages/projects.pug)
  ↓
HTML Response
```

### 2. API Request Flow (Authenticated)

```
Client → POST /api/projects (with JWT)
  ↓
Rate Limiter Middleware
  ↓
Project Routes (project.routes.ts)
  ↓
Auth Middleware (authenticate)
  ↓
Validation Middleware (validate)
  ↓
Project Controller (create)
  ↓
Project Service (create)
  ↓
Project Model (create)
  ↓
Database INSERT
  ↓
JSON Response
```

### 3. Authentication Flow

```
Client → POST /api/auth/login {username, password}
  ↓
Auth Limiter (5 requests/15 min)
  ↓
Validation Middleware
  ↓
Auth Controller (login)
  ↓
Auth Service (login)
  ├── Find user by username
  ├── Verify password (bcrypt)
  ├── Generate access token (JWT)
  ├── Generate refresh token (JWT)
  ├── Save refresh token to DB
  └── Update lastLogin
  ↓
Response: {accessToken, refreshToken, user}
```

## Security

### 1. Authentication & Authorization
- JWT-based stateless authentication
- Access tokens expire in 1 hour
- Refresh tokens stored in database, expire in 7 days
- Passwords hashed with bcrypt (10 salt rounds)

### 2. Rate Limiting
- General API: 100 requests/minute
- Auth endpoints: 5 requests/15 minutes
- Configurable via environment variables

### 3. Security Headers
- Helmet middleware for security headers
- CSP disabled for Pug inline scripts (configurable)

### 4. CORS
- Configured origin from environment
- Credentials support enabled

### 5. Input Validation
- All inputs validated with express-validator
- SQL injection prevention via Sequelize parameterized queries
- XSS prevention via input sanitization

### 6. Environment Variables
- Sensitive data in .env (not committed)
- .env.example provided as template
- JWT secrets must be changed in production

## Getting Started

### Prerequisites
- Node.js 16+
- MySQL 5.7+ or 8.0+
- npm or yarn

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Create database:**
   ```bash
   mysql -u root -p
   CREATE DATABASE portfolio;
   ```

4. **Run migrations:**
   ```bash
   npm run migrate
   ```

5. **Seed initial data:**
   ```bash
   npm run seed
   ```

6. **Start development server:**
   ```bash
   npm run dev
   ```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run compiled production build
- `npm run migrate` - Create database tables
- `npm run seed` - Seed database with initial data
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Default Credentials

After seeding, login with:
- Username: `admin` (from ADMIN_USERNAME env)
- Password: `Admin@123` (from ADMIN_PASSWORD env)

### API Endpoints

**Authentication:**
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

**Projects (Protected):**
- `GET /api/projects` - List projects (with pagination, filtering, search)
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

**Achievements (Protected):**
- `GET /api/achievements` - List achievements
- `GET /api/achievements/:id` - Get achievement by ID
- `POST /api/achievements` - Create achievement
- `PUT /api/achievements/:id` - Update achievement
- `DELETE /api/achievements/:id` - Delete achievement

**Public Views:**
- `GET /` - Home page
- `GET /projects` - Projects listing
- `GET /achievements` - Achievements listing
- `GET /skills` - Skills page
- `GET /experience` - Experience page

**Admin Views (Protected):**
- `GET /admin/login` - Admin login page
- `GET /admin/dashboard` - Admin dashboard
- `GET /admin/projects` - Manage projects
- `GET /admin/achievements` - Manage achievements

### Environment Variables

See [.env.example](.env.example) for all available configuration options:
- Application settings (PORT, NODE_ENV)
- Database credentials
- JWT configuration
- Rate limiting settings
- Initial admin credentials

## Next Steps

- Review the [models](src/models/) to understand the data schema
- Explore [services](src/services/) for business logic implementation
- Check [controllers](src/controllers/) for API request handling
- Examine [views](src/views/) for template structure
- Read [validators](src/validators/) for input validation rules
