import { Request, Response, NextFunction } from 'express';
import ProjectModel from '../models/project.model';
import { CreateIssueIncomeDataType } from '../types/create-issue-income-data.type';
import { IUser } from '../models/user.model';

export const validateIssueCreation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, project, column, deadline, assignedTo, tasks } =
      req.body as CreateIssueIncomeDataType;

    if (!title || typeof title !== 'string') {
      res.status(400).json({ error: true, message: 'Invalid issue title' });
      return;
    }

    if (!description || typeof description !== 'string') {
      res
        .status(400)
        .json({ error: true, message: 'Invalid issue description' });
      return;
    }

    if (!project || typeof project !== 'string') {
      res.status(400).json({ error: true, message: 'Invalid "project" field' });
      return;
    }

    const findedProject = await ProjectModel.findOne({
      slug: project,
    }).populate<{ participants: Partial<IUser>[] }>({
      path: 'participants',
      select: 'email',
    });

    if (!findedProject) {
      res
        .status(400)
        .json({ error: true, message: `Can't find project "${project}"` });
      return;
    }

    const columns = findedProject.columns.map((column) => column.title);
    if (!columns.includes(column)) {
      res.status(400).json({
        error: true,
        message: `
        Column with title "${column}" is not exists in project "${project}"
        `,
      });
      return;
    }

    if (deadline) {
      if (
        typeof deadline !== 'string' ||
        new Date(deadline).toISOString() !== deadline
      ) {
        res
          .status(400)
          .json({ error: true, message: 'Invalid "deadline" field format' });
        return;
      }
    }

    if (assignedTo) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (
        !Array.isArray(assignedTo) ||
        !assignedTo.every((item) => typeof item === 'string') ||
        !assignedTo.every((item) => emailRegex.test(item))
      ) {
        res
          .status(400)
          .json({ error: true, message: 'Invalid "assignedTo" field format' });
        return;
      }
      const projectParticipantsEmails = findedProject.participants.map(
        (participant) => participant.email
      );
      if (
        !assignedTo.every((item) => projectParticipantsEmails.includes(item))
      ) {
        res.status(400).json({
          error: true,
          message: `
            There is user(s) who doesn't participate \
            in project "${project}" in "assignedTo" list
            `,
        });
        return;
      }
    }

    if (tasks) {
      if (
        !Array.isArray(tasks) ||
        !tasks.every((task) => typeof task === 'string')
      ) {
        res
          .status(400)
          .json({ error: true, message: 'Invalid "tasks" field format' });
        return;
      }
    }

    next();
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: true, message: 'Unknown internal server error' });
  }
};
