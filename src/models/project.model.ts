import mongoose, { Schema, Document, Types } from 'mongoose';
import { IUser } from './user.model';

export interface IProject extends Document {
  name: string;
  createdAt: string;
  updatedAt: string;
  moderator: Types.ObjectId | Partial<IUser>;
  participants: Types.ObjectId[] | Partial<IUser>[];
  columns: {
    title: string;
    slug: string;
    order: number;
  }[];
  slug: string;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    createdAt: {
      type: String,
      required: true,
      default: () => new Date().toISOString(),
    },
    updatedAt: {
      type: String,
      required: true,
      default: () => new Date().toISOString(),
    },
    moderator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    participants: [
      { type: Schema.Types.ObjectId, ref: 'User', required: true },
    ],
    slug: { type: String, required: true, unique: true },
    columns: [
      {
        title: { type: String, required: true },
        slug: { type: String, required: true },
        order: { type: Number, required: true },
      },
    ],
  },
  {
    versionKey: false,
  }
);

ProjectSchema.pre<IProject>('save', function (next) {
  if (this.isNew) {
    this.createdAt = new Date().toISOString();
  }
  this.updatedAt = new Date().toISOString();

  next();
});

const ProjectModel = mongoose.model<IProject>('Project', ProjectSchema);

export default ProjectModel;
