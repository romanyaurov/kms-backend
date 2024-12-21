import TokenModel from '../models/token.model';
import UserModel from '../models/user.model';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt.util';

class AuthService {
  static async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await UserModel.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Invalid email or password');
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    const savedTokens = await new TokenModel({
      userId: user.id,
      refreshToken,
    }).save();

    if (!savedTokens) {
      throw new Error('Error saving tokens');
    }

    return { accessToken, refreshToken };
  }

  static async refresh(
    refreshToken: string
  ): Promise<{ newAccessToken: string; newRefreshToken: string }> {
    const payload = verifyRefreshToken(refreshToken);

    const tokenEntry = await TokenModel.findOne({ refreshToken });
    if (!tokenEntry) throw new Error('Invalid refresh token');

    const newAccessToken = generateAccessToken(payload.userId);
    const newRefreshToken = generateRefreshToken(payload.userId);

    tokenEntry.refreshToken = newRefreshToken;
    await tokenEntry.save();

    return { newAccessToken, newRefreshToken };
  }

  static async logout(refreshToken: string): Promise<string> {
    const result = await TokenModel.findOneAndDelete({ refreshToken });

    if (!result) throw new Error('Error logging out');

    return 'Logged out successfully';
  }
}

export default AuthService;
