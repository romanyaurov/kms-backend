import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITask {
  text: string;
  isCompleted: boolean;
}

export interface IIssue extends Document {
  title: string;
  createdAt: Date;
  updatedAt: Date;
  description: string;
  assignedTo: Types.ObjectId[];
  tasks: ITask[];
  project: string;
  column: string;
  order: number;
}

const IssueSchema = new Schema<IIssue>(
  {
    title: { type: String, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
    description: { type: String, required: true },
    assignedTo: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    tasks: [
      {
        text: { type: String, required: true },
        isCompleted: { type: Boolean, required: true },
      },
    ],
    project: { type: String, required: true },
    column: { type: String, required: true },
    order: { type: Number, required: true },
  },
  {
    versionKey: false,
  }
);

const IssueModel = mongoose.model<IIssue>('Issue', IssueSchema);

export default IssueModel;
