import { Types } from 'mongoose';
import UserModel, { IUser } from '../models/user.model';
import generateUserAvatarString from '../utils/generate-user-avatar.util';

export type AddUserDataType = {
  firstName: string;
  lastName: string;
  email: string;
  post: string;
  skills: string[];
};

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

  static async addUser(userData: AddUserDataType): Promise<IUser> {
    const newUser = new UserModel({
      ...userData,
      avatar: generateUserAvatarString(userData.firstName, userData.lastName),
    });
    const savedUser = await newUser.save();

    if (!savedUser) {
      throw new Error('Error adding user');
    }

    return savedUser;
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
