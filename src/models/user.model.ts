import mongoose, { Schema, Document } from 'mongoose';
import bcryptjs from 'bcryptjs';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  post: string;
  avatar: string;
  skills: string[];
  createdAt: string;
  updatedAt: string;
  password: string;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    post: { type: String },
    avatar: { type: String, required: true },
    skills: { type: [String] },
    createdAt: {
      type: String,
      required: true,
      default: new Date().toISOString(),
    },
    updatedAt: {
      type: String,
      required: true,
      default: new Date().toISOString(),
    },
    password: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);

  if (this.isNew) {
    this.createdAt = new Date().toISOString();
  }
  this.updatedAt = new Date().toISOString();

  next();
});

UserSchema.methods.comparePassword = function (
  password: string
): Promise<boolean> {
  return bcryptjs.compare(password, this.password);
};

const UserModel = mongoose.model<IUser>('User', UserSchema);

export default UserModel;
