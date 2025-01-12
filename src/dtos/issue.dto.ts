import { Types } from 'mongoose';
import { IIssue } from '../models/issue.model';

export class IssueDTO {
  id: string;
  title: string;
  description: string;
  column: string;
  order: number;
  tasks?: {
    id: string;
    text: string;
    isCompleted: boolean;
  }[];
  assignedTo?: {
    id: string;
    firstName: string;
    lastName: string;
    post: string;
    email: string;
    avatar: string;
  }[];
  deadline?: string;
  createdAt: string;
  updatedAt: string;

  constructor(
    issue: IIssue & {
      assignedTo: {
        _id: Types.ObjectId;
        firstName: string;
        lastName: string;
        post: string;
        email: string;
        avatar: string;
      }[];
      tasks: { _id: Types.ObjectId; text: string; isCompleted: boolean }[];
    }
  ) {
    this.id = issue._id as string;
    this.title = issue.title;
    this.description = issue.description;
    this.column = issue.column;
    this.order = issue.order;
    this.createdAt = issue.createdAt;
    this.updatedAt = issue.updatedAt;

    if (issue.tasks) {
      this.tasks = issue.tasks.map((task) => ({
        id: task._id.toString(),
        text: task.text,
        isCompleted: task.isCompleted,
      }));
    }

    if (issue.assignedTo) {
      this.assignedTo = issue.assignedTo.map((user) => ({
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        post: user.post,
        email: user.email,
        avatar: user.avatar,
      }));
    }

    if (issue.deadline) {
      this.deadline = issue.deadline;
    }
  }
}
