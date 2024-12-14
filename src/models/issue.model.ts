import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITask extends Document {
  text: string;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IIssue extends Document {
  title: string;
  createdAt: Date;
  updatedAt: Date;
  deadline: Date;
  description: string;
  assignedTo: Types.ObjectId[];
  tasks: ITask[];
  project: Types.ObjectId;
  column: Types.ObjectId;
  order: number;
}

const IssueSchema = new Schema<IIssue>(
  {
    title: { type: String, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
    deadline: { type: Date, required: true },
    description: { type: String, required: true },
    assignedTo: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    tasks: [
      {
        text: { type: String, required: true },
        isCompleted: { type: Boolean, required: true },
        createdAt: { type: Date, required: true },
        updatedAt: { type: Date, required: true },
      },
    ],
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    column: { type: Schema.Types.ObjectId, required: true },
    order: { type: Number, required: true },
  },
  {
    versionKey: false,
  }
);

const IssueModel = mongoose.model<IIssue>('Issue', IssueSchema);

export default IssueModel;
