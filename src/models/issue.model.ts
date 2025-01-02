import mongoose, { Schema, Document, Types } from 'mongoose';
import { IUser } from './user.model';
import { UserDTO } from '../dtos/user.dto';

export interface ITask extends Document {
  text: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IIssue extends Document {
  title: string;
  createdAt: string;
  updatedAt: string;
  deadline?: string;
  description: string;
  assignedTo?: Types.ObjectId[] | Partial<IUser>[];
  tasks?: ITask[] | Partial<ITask>[];
  project: Types.ObjectId;
  column: string;
  order: number;
}

const IssueSchema = new Schema<IIssue>(
  {
    title: { type: String, required: true },
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
    deadline: { type: String },
    description: { type: String, required: true },
    assignedTo: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }] },
    tasks: {
      type: [
        {
          text: { type: String, required: true },
          isCompleted: { type: Boolean, required: true },
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
        },
      ],
    },
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    column: { type: String, required: true },
    order: { type: Number, required: true },
  },
  {
    versionKey: false,
  }
);

IssueSchema.pre<IIssue>('save', function (next) {
  if (this.isNew) {
    this.createdAt = new Date().toISOString();
  }
  this.updatedAt = new Date().toISOString();

  next();
});

const IssueModel = mongoose.model<IIssue>('Issue', IssueSchema);

export default IssueModel;
