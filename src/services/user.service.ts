import { Types } from 'mongoose';
import bcryptjs from 'bcryptjs';
import UserModel, { IUser } from '../models/user.model';
import { SignupIncomeDataType } from '../types/signup-income-data.type';
import saveBase64AsJpg from '../utils/save-base64-as-jpg.util';

class UserService {
  static async getAllUsers(): Promise<IUser[]> {
    const users = await UserModel.find();

    if (!users) {
      throw new Error('Error fetching users');
    }

    return users;
  }

  static async getUser(userId: string): Promise<IUser> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID format');
    }

    const user = await UserModel.findById(userId);

    if (!user) throw new Error('User not found');

    return user;
  }

  static async addUser(userData: SignupIncomeDataType): Promise<string> {
    const savedAvatar = userData.avatar
      ? await saveBase64AsJpg(
          userData.avatar,
          userData.firstName,
          userData.lastName
        )
      : 'default_avatar.jpg';

    const newUser = new UserModel({
      ...userData,
      avatar: savedAvatar,
    });

    const savedUser = await newUser.save();

    if (!savedUser) {
      throw new Error('Error adding user');
    }

    return 'Signup seccessful';
  }

  static async deleteUser(userId: string): Promise<string> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID format');
    }

    const result = await UserModel.findByIdAndDelete(userId);

    if (!result) throw new Error('User not found');

    return `User with ID ${userId} has been deleted successfully.`;
  }
}

export default UserService;
