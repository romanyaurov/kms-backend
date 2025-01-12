import { Types } from 'mongoose';
import { IProject } from '../models/project.model';

export class ProjectDTO {
  id: string;
  name: string;
  slug: string;
  moderator: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
  };
  participants: {
    id: string;
    email: string;
    avatar: string;
  }[];
  columns: {
    title: string;
    slug: string;
    order: number;
  }[];
  createdAt: string;
  updatedAt: string;

  constructor(
    project: IProject & {
      moderator: {
        _id: Types.ObjectId;
        firstName: string;
        lastName: string;
        email: string;
        avatar: string;
      };
      participants: { _id: Types.ObjectId; email: string; avatar: string }[];
      columns: { title: string; slug: string; order: number }[];
    }
  ) {
    this.id = project._id as string;
    this.name = project.name;
    this.slug = project.slug;
    this.createdAt = project.createdAt;
    this.updatedAt = project.updatedAt;
    this.moderator = {
      id: project.moderator._id.toString(),
      firstName: project.moderator.firstName,
      lastName: project.moderator.lastName,
      email: project.moderator.email,
      avatar: project.moderator.avatar,
    };
    this.participants = project.participants.map((participant) => ({
      id: participant._id.toString(),
      email: participant.email,
      avatar: participant.avatar,
    }));
    this.columns = project.columns;
  }
}
