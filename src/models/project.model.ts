import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IColumn extends Document {
  title: string;
  order: number;
}

export interface IProject extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
  moderator: Types.ObjectId;
  columns: IColumn[];
  slug: string;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
    moderator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    slug: { type: String, required: true },
    columns: [
      {
        title: { type: String, required: true },
        order: { type: Number, required: true },
      },
    ],
  },
  {
    versionKey: false,
  }
);

const ProjectModel = mongoose.model<IProject>('Project', ProjectSchema);

export default ProjectModel;
