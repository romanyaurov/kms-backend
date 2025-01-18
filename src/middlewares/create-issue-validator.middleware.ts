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

    // Проверка поля title
    if (!title || typeof title !== 'string') {
      res.status(400).json({ error: true, message: 'Invalid issue title' });
      return;
    }

    // Проверка поля description
    if (!description || typeof description !== 'string') {
      res
        .status(400)
        .json({ error: true, message: 'Invalid issue description' });
      return;
    }

    // Проверка поля project
    if (!project || typeof project !== 'string') {
      res.status(400).json({ error: true, message: 'Invalid "project" field' });
      return;
    }

    // Ищем проект по slug из поля project, от участников берём только email
    const findedProject = await ProjectModel.findOne({
      slug: project,
    }).populate<{ participants: Partial<IUser>[] }>({
      path: 'participants',
      select: 'email',
    });

    // Проверяем что проект найден
    if (!findedProject) {
      res
        .status(400)
        .json({ error: true, message: `Can't find project "${project}"` });
      return;
    }

    // Проверяем что в найденном проекте есть нужный нам столбец
    const findedColumn = findedProject.columns.find((item) => item.slug === column);
    if (!findedColumn) {
      res.status(400).json({
        error: true,
        message: `
        Column with title "${column}" is not exists in project "${project}"
        `,
      });
      return;
    }

    // Проверяем поле deadline
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

    // Проверяем поле с назначенными пользователями
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

    // Проверяем поле tasks
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
