# JamSync Backend

A Node.js/Express backend for the JamSync music collaboration platform.

## Features

- **Express.js** server with TypeScript
- **Prisma ORM** for database management
- **JWT Authentication** with bcrypt password hashing
- **CORS** enabled for Next.js frontend (localhost:3000)
- **RESTful API** endpoints for Auth, Tracks, and Users

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login and get JWT token

### Tracks
- `GET /api/v1/tracks` - List all tracks (with pagination)
- `GET /api/v1/tracks/:id` - Get single track
- `POST /api/v1/tracks` - Create a track (authenticated)
- `DELETE /api/v1/tracks/:id` - Delete a track (authenticated, owner only)
- `GET /api/v1/tracks/:id/remixes` - Get remixes of a track

### Users
- `GET /api/v1/users/:username` - Get user profile
- `GET /api/v1/users/:username/tracks` - Get user's tracks
- `GET /api/v1/users/:username/followers` - Get followers
- `GET /api/v1/users/:username/following` - Get following
- `POST /api/v1/users/:username/follow` - Follow a user (authenticated)
- `DELETE /api/v1/users/:username/unfollow` - Unfollow a user (authenticated)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Seed the database (optional):
   ```bash
   npm run seed
   ```

## Development

Run the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3001`

## Production

Build and start:
```bash
npm run build
npm start
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | postgresql://user:password@localhost:5432/jamsync |
| JWT_SECRET | Secret key for JWT tokens | your-super-secret-jwt-key-change-in-production |
| JWT_EXPIRES_IN | Token expiration time | 7d |
| PORT | Server port | 3001 |
| CORS_ORIGin | Allowed CORS origin | http://localhost:3000 |
| NODE_ENV | Environment mode | development |
