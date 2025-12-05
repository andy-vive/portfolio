import dotenv from 'dotenv';

dotenv.config();

export const jwtConfig = {
  secret: (process.env.JWT_SECRET || 'your-secret-key-change-in-production') as string,
  accessTokenExpiresIn: (process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '1h') as string,
  refreshTokenExpiresIn: (process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || '7d') as string,
};
