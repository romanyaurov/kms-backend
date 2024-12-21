import { IUser } from '../models/user.model';

export class UserDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  post?: string;
  skills?: string[];

  constructor(user: IUser) {
    this.id = user._id as string;
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.avatar = user.avatar;

    if (user.post) this.post = user.post;
    if (user.skills) this.skills = user.skills;
  }
}
