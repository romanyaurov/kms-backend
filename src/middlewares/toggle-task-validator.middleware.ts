import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import IssueModel from '../models/issue.model';

export const validateTaskToggle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { taskId } = req.params as { taskId: string };

    if (!Types.ObjectId.isValid(taskId)) {
      res.status(400).json({ error: true, message: 'Invalid Task ID' });
      return;
    }

    const targetIssue = await IssueModel.findOne(
      { 'tasks._id': taskId },
      { _id: 1 }
    );

    if (!targetIssue) {
      res
        .status(404)
        .json({ error: true, message: 'No issue found containing this task' });
      return;
    }

    next();
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: true, message: 'Unknown internal server error' });
  }
};
