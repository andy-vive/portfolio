import dotenv from 'dotenv';

dotenv.config();

// Validate that JWT_SECRET is set - fail fast if missing
if (!process.env.JWT_SECRET) {
  throw new Error(
    'FATAL: JWT_SECRET environment variable is not set. ' +
    'Please set JWT_SECRET in your .env file before starting the application.'
  );
}

export const jwtConfig = {
  secret: process.env.JWT_SECRET,
  accessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '1h',
  refreshTokenExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || '7d',
};
