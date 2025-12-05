import { User, RefreshToken } from '../models';
import { comparePassword } from '../utils/bcrypt.util';
import { generateAccessToken, generateRefreshToken, JwtPayload } from '../utils/jwt.util';
import { AppError } from '../middleware/error.middleware';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    username: string;
  };
}

export class AuthService {
  async login(username: string, password: string): Promise<LoginResponse> {
    // Find user by username
    const user = await User.findOne({ where: { username } });

    if (!user) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid username or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AppError(403, 'ACCOUNT_DISABLED', 'Account is disabled');
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid username or password');
    }

    // Generate tokens
    const payload: JwtPayload = {
      userId: user.id,
      username: user.username,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Save refresh token to database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await RefreshToken.create({
      userId: user.id,
      token: refreshToken,
      expiresAt,
    });

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
      },
    };
  }

  async logout(refreshToken: string): Promise<void> {
    // Delete the refresh token from database
    await RefreshToken.destroy({ where: { token: refreshToken } });
  }
}

export default new AuthService();
