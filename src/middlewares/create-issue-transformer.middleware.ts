import { Request, Response, NextFunction } from 'express';
import { CreateIssueIncomeDataType } from '../types/create-issue-income-data.type';
import ProjectModel from '../models/project.model';
import { IUser } from '../models/user.model';
import IssueModel from '../models/issue.model';

export const transformIssueCreation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { project, assignedTo, tasks } =
      req.body as CreateIssueIncomeDataType;

    const targetProject = await ProjectModel.findOne({  slug: project })
      .populate<{ participants: Partial<IUser>[] }>({
        path: 'participants',
        select: 'email',
      });

    // Меняем slug на ObjectId
    req.body.project = targetProject!._id;

    // Меняем email'ы пользователей на их ObjectId
    req.body.assignedTo =
      assignedTo?.map(
        (userEmail) =>
          targetProject!.participants.find(
            (participant) => participant.email === userEmail
          )!._id
      ) || [];

    // Трансформируем tasks
    req.body.tasks =
      tasks?.map((task) => ({
        title: task,
        isCompleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })) || [];

    // Добавляем order
    req.body.order =
      (await IssueModel.countDocuments({
        project: req.body.project,
        column: req.body.column,
      })) + 1;

    next();
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: true, message: 'Unknown internal server error' });
  }
};
