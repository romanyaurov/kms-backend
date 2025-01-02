import { UserDTO } from '../dtos/user.dto';
import TokenModel from '../models/token.model';
import UserModel from '../models/user.model';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../utils/jwt.util';

class AuthService {
  static async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{
    user: UserDTO;
    refreshToken: string;
    accessToken: string;
  }> {
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

    return {
      user: new UserDTO(user),
      accessToken,
      refreshToken,
    };
  }

  static async logout(refreshToken: string): Promise<string> {
    const result = await TokenModel.findOneAndDelete({ refreshToken });

    if (!result) throw new Error('Error logging out');

    return 'Logged out successfully';
  }
}

export default AuthService;
