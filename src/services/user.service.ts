import { Types } from 'mongoose';
import UserModel, { IUser } from '../models/user.model';
import { SignupIncomeDataType } from '../types/signup-income-data.type';
import saveBase64AsJpg from '../utils/save-base64-as-jpg.util';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.util';
import ProjectModel from '../models/project.model';
import { UserDTO } from '../dtos/user.dto';

class UserService {
  // static async getAllUsers(userId: string): Promise<UserDTO[]> {
  //   const userObjectId = new Types.ObjectId(userId);

  //   const projects = await ProjectModel.find({
  //     participants: { $in: [userObjectId] },
  //   }).select('participants -_id');

  //   if (!projects) {
  //     throw new Error('Error fetching connected projects');
  //   }

  //   const allParticipants: Types.ObjectId[] = projects.flatMap(
  //     (project) => project.participants
  //   );

  //   const uniqueParticipantIds = Array.from(
  //     new Set(allParticipants.map((id) => id.toString()))
  //   )
  //     .filter((id) => id !== userId)
  //     .map((id) => new Types.ObjectId(id));

  //   const uniqueUsers = await UserModel.find({
  //     _id: { $in: uniqueParticipantIds },
  //   });

  //   if (!uniqueUsers) throw new Error('Error fetching users');

  //   return uniqueUsers.map((user) => new UserDTO(user));
  // }

  static async getUserInfo(userId: string): Promise<UserDTO> {
    const userObjectId = new Types.ObjectId(userId);

    const user = await UserModel.findById(userObjectId);

    if (!user) throw new Error('User not found');

    return new UserDTO(user);
  }

  static async addUser(
    userData: SignupIncomeDataType
  ): Promise<{ accessToken: string; refreshToken: string; userAvatar: string; }> {
    const savedAvatar = userData.avatar
      ? await saveBase64AsJpg(
          userData.avatar,
          userData.firstName,
          userData.lastName
        )
      : 'default_avatar.jpg';

    const newUser = await new UserModel({
      ...userData,
      avatar: savedAvatar,
    }).save();

    if (!newUser) {
      throw new Error('Error adding user');
    }

    const accessToken = generateAccessToken(newUser._id as string);
    const refreshToken = generateRefreshToken(newUser._id as string);
    const userAvatar = newUser.avatar;

    return { accessToken, refreshToken, userAvatar };
  }
}

export default UserService;
