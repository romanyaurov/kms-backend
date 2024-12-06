import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  post: string;
  avatar: string;
  skills: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    post: { type: String, required: true },
    avatar: { type: String, required: true },
    skills: { type: [String], required: true },
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  {
    versionKey: false,
  }
);

const UserModel = mongoose.model<IUser>('User', UserSchema);

export default UserModel;
