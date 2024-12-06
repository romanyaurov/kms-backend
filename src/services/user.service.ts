import { Types } from 'mongoose';
import UserModel, { IUser } from '../models/user.model';
import detectErrorMessage from '../utils/error-message.util';

class UserService {
  static async getAllUsers(): Promise<IUser[]> {
    try {
      const users = await UserModel.find();
      return users;
    } catch (error) {
      throw new Error(`Error fetching users: ${detectErrorMessage(error)}`);
    }
  }

  static async getUser(userId: string): Promise<IUser | null> {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error(`User with ID ${userId} not found`);
      }
      return user;
    } catch (error) {
      throw new Error(`Error fetching users: ${detectErrorMessage(error)}`);
    }
  }

  static async addUser(userData: {
    firstName: string;
    lastName: string;
    email: string;
    post: string;
    skills: string[];
  }) {
    try {
      const newUserData = {
        ...userData,
        avatar: `${userData.firstName.toLowerCase()}_${userData.lastName.toLowerCase()}.jpg`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const newUser = new UserModel(newUserData);
      const savedUser = await newUser.save();
      return savedUser;
    } catch (error) {
      throw new Error(`Error adding user: ${detectErrorMessage(error)}`);
    }
  }

  static async deleteUser(userId: string): Promise<string> {
    try {
      if (!Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid user ID format');
      }

      const result = await UserModel.findByIdAndDelete(userId);

      if (!result) throw new Error('User not found');

      return `User with ID ${userId} has been deleted successfully.`;
    } catch (error) {
      throw new Error(`Error deleting user: ${detectErrorMessage(error)}`);
    }
  }
}

export default UserService;
