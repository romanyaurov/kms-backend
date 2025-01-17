import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import IssueModel from '../models/issue.model';
import ProjectModel from '../models/project.model';

export const validateTaskToggle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { taskId } = req.params as { taskId: string };
    const user = new Types.ObjectId(req.user);

    if (!Types.ObjectId.isValid(taskId)) {
      res.status(400).json({ error: true, message: 'Invalid Task ID' });
      return;
    }

    const targetIssue = await IssueModel.findOne({ 'tasks._id': taskId });

    if (!targetIssue) {
      res
        .status(404)
        .json({ error: true, message: 'No issue found containing this task' });
      return;
    }

    if (!(targetIssue.assignedTo as Types.ObjectId[])?.includes(user)) {
      const targetProject = await ProjectModel.findById(targetIssue.project);

      if (!(targetProject!.moderator as Types.ObjectId).equals(user)) {
        res
          .status(401)
          .json({
            error: true,
            message: 'You have no permission to edit this task',
          });
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
