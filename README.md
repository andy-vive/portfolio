# Portfolio Website

A full-stack personal portfolio web application built with Node.js, Express, TypeScript, and MySQL. Features both public-facing portfolio pages and an admin dashboard for content management.

## Features

### Public Features
- Responsive portfolio homepage
- Projects showcase with filtering and search
- Achievements and accomplishments listing
- Skills and technologies overview
- Professional experience timeline

### Admin Features
- Secure admin authentication (JWT-based)
- Dashboard for content management
- CRUD operations for projects and achievements
- Real-time content updates

### Technical Features
- RESTful API with comprehensive validation
- Server-side rendering with Pug templates
- JWT authentication with refresh tokens
- Rate limiting and security headers
- Database migrations and seeding
- Type-safe development with TypeScript

## Technology Stack

- **Backend:** Node.js, Express 5.x, TypeScript 5.x
- **Database:** MySQL with Sequelize ORM
- **Template Engine:** Pug
- **Authentication:** JWT with bcrypt password hashing
- **Security:** Helmet, CORS, express-rate-limit
- **Validation:** express-validator
- **Development:** nodemon, ts-node, ESLint, Prettier

## Quick Start

### Prerequisites

- Node.js 16 or higher
- MySQL 5.7+ or 8.0+
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure:
   - Database credentials
   - JWT secret (change in production!)
   - Admin credentials
   - Other settings as needed

4. Create the database:
   ```bash
   mysql -u root -p
   CREATE DATABASE portfolio;
   exit
   ```

5. Run database migrations:
   ```bash
   npm run migrate
   ```

6. Seed initial data (creates admin user):
   ```bash
   npm run seed
   ```

7. Start the development server:
   ```bash
   npm run dev
   ```

8. Open your browser and navigate to:
   - Public site: http://localhost:3000
   - Admin login: http://localhost:3000/admin/login

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run compiled production build |
| `npm run migrate` | Create database tables from models |
| `npm run seed` | Seed database with initial admin user |
| `npm run lint` | Run ESLint for code quality |
| `npm run format` | Format code with Prettier |
| `npm test` | Run tests (placeholder) |

## Project Structure

```
portfolio/
├── src/
│   ├── config/          # Database, JWT, migration configs
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth, validation, error handling
│   ├── models/          # Sequelize models
│   ├── routes/          # API and view routes
│   ├── services/        # Business logic
│   ├── types/           # TypeScript definitions
│   ├── utils/           # Helper functions
│   ├── validators/      # Input validation schemas
│   ├── views/           # Pug templates
│   ├── public/          # Static assets (CSS, JS, images)
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── dist/                # Compiled JavaScript
├── .env.example         # Environment variables template
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies and scripts
```

For detailed architecture documentation, see [ARCHITECTURE.md](ARCHITECTURE.md).

## API Documentation

### Authentication

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "Admin@123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "admin"
    }
  },
  "message": "Login successful"
}
```

#### Logout
```http
POST /api/auth/logout
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

### Projects

All project endpoints require authentication. Include the JWT token in the Authorization header:
```http
Authorization: Bearer your-access-token
```

#### List Projects
```http
GET /api/projects?page=1&limit=10&search=nodejs&company=acme&technology=react
```

Query Parameters:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `search` (optional): Search in title, description, role
- `company` (optional): Filter by company name
- `technology` (optional): Filter by technology
- `startDate` (optional): Filter by start date
- `endDate` (optional): Filter by end date
- `sortBy` (optional): Sort field (title, company, startDate, endDate, createdAt, updatedAt)
- `sortOrder` (optional): ASC or DESC
- `includeAchievements` (optional): Include related achievements

#### Get Project by ID
```http
GET /api/projects/:id?includeAchievements=true
```

#### Create Project
```http
POST /api/projects
Content-Type: application/json

{
  "title": "E-commerce Platform",
  "company": "Tech Corp",
  "description": "Built a scalable e-commerce platform",
  "startDate": "2023-01-01",
  "endDate": "2023-12-31",
  "teamSize": 5,
  "role": "Full Stack Developer",
  "responsibilities": [
    "Developed RESTful APIs",
    "Implemented payment integration",
    "Optimized database queries"
  ],
  "technologies": [
    "Node.js",
    "React",
    "PostgreSQL",
    "Docker"
  ]
}
```

#### Update Project
```http
PUT /api/projects/:id
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description"
}
```

#### Delete Project
```http
DELETE /api/projects/:id
```

### Achievements

Similar to projects, all achievement endpoints require authentication.

#### List Achievements
```http
GET /api/achievements?page=1&limit=10&search=award
```

#### Create Achievement
```http
POST /api/achievements
Content-Type: application/json

{
  "title": "Best Performance Award",
  "description": "Awarded for outstanding performance",
  "impact": "Improved team productivity by 30%",
  "metrics": "30% productivity increase",
  "projectId": 1
}
```

For complete API documentation, see the route files in [src/routes/](src/routes/).

## Database Schema

### Users
- `id` (Primary Key)
- `username` (Unique)
- `password_hash`
- `is_active`
- `last_login`
- `created_at`, `updated_at`

### RefreshTokens
- `id` (Primary Key)
- `user_id` (Foreign Key → Users)
- `token`
- `expires_at`
- `created_at`, `updated_at`

### Projects
- `id` (Primary Key)
- `title`
- `company`
- `description`
- `start_date`
- `end_date`
- `team_size`
- `role`
- `responsibilities` (JSON array)
- `technologies` (JSON array)
- `created_at`, `updated_at`

### Achievements
- `id` (Primary Key)
- `title`
- `description`
- `impact`
- `metrics`
- `project_id` (Foreign Key → Projects, nullable)
- `created_at`, `updated_at`

## Security

### Authentication
- JWT-based authentication with access and refresh tokens
- Access tokens expire in 1 hour
- Refresh tokens expire in 7 days and are stored in database
- Passwords hashed with bcrypt (10 rounds)

### Rate Limiting
- General API: 100 requests per minute
- Authentication endpoints: 5 requests per 15 minutes

### Security Headers
- Helmet middleware for secure HTTP headers
- CORS configured for allowed origins
- Content Security Policy (customizable)

### Input Validation
- All inputs validated with express-validator
- SQL injection prevention via Sequelize ORM
- XSS prevention via input sanitization

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Application
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=portfolio

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_ACCESS_TOKEN_EXPIRES_IN=1h
JWT_REFRESH_TOKEN_EXPIRES_IN=7d

# Admin User
ADMIN_USERNAME=admin
ADMIN_PASSWORD=Admin@123

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

# Security
BCRYPT_SALT_ROUNDS=10
```

**Important:** Change `JWT_SECRET` and admin credentials in production!

## Development

### Code Style
- TypeScript with strict mode enabled
- ESLint for linting
- Prettier for formatting
- No unused locals or parameters
- Explicit return types encouraged

### Adding New Features

1. **Create Model:** Define Sequelize model in [src/models/](src/models/)
2. **Add Types:** Create TypeScript types in [src/types/](src/types/)
3. **Create Validators:** Add validation schemas in [src/validators/](src/validators/)
4. **Implement Service:** Add business logic in [src/services/](src/services/)
5. **Create Controller:** Add request handlers in [src/controllers/](src/controllers/)
6. **Define Routes:** Register routes in [src/routes/](src/routes/)
7. **Update Migration:** Modify [src/config/migrate.ts](src/config/migrate.ts) if needed

### Database Changes

After modifying models:
```bash
# Drop all tables and recreate
npm run migrate

# Reseed data
npm run seed
```

## Production Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Set environment to production:
   ```env
   NODE_ENV=production
   ```

3. Update security settings:
   - Change JWT_SECRET to a strong random value
   - Update admin credentials
   - Configure proper CORS origins
   - Enable HTTPS
   - Set up proper database credentials

4. Run migrations:
   ```bash
   npm run migrate
   ```

5. Start the server:
   ```bash
   npm start
   ```

### Production Checklist
- [ ] Change JWT_SECRET
- [ ] Update admin credentials
- [ ] Configure CORS for production domain
- [ ] Enable HTTPS/SSL
- [ ] Set up database backups
- [ ] Configure proper logging
- [ ] Set up monitoring
- [ ] Enable production error tracking
- [ ] Review and tighten rate limits
- [ ] Set up reverse proxy (nginx/Apache)

## Troubleshooting

### Database Connection Issues
- Verify MySQL is running: `mysql -u root -p`
- Check database credentials in `.env`
- Ensure database exists: `CREATE DATABASE portfolio;`

### Migration Errors
- Drop all tables and recreate: `npm run migrate`
- Check model definitions for conflicts

### Authentication Issues
- Verify JWT_SECRET is set in `.env`
- Check token expiration settings
- Ensure refresh token exists in database

### Port Already in Use
- Change PORT in `.env`
- Kill process using port 3000: `lsof -ti:3000 | xargs kill`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## License

ISC License - see LICENSE file for details

## Author

Andy <duy945@gmail.com>

## Support

For issues and questions, please open an issue on the repository.
