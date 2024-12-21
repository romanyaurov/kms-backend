import { Request, Response, NextFunction } from 'express';
import ProjectModel from '../models/project.model';
import { MoveIssueIncomeDataType } from '../types/move-issue-income-data.type';
import { Types } from 'mongoose';
import IssueModel from '../models/issue.model';

export const validateIssueMoving = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { issueId } = req.params as { issueId: string };
    const { targetColumn } = req.body as MoveIssueIncomeDataType;

    if (!Types.ObjectId.isValid(issueId)) {
      res.status(400).json({ error: true, message: 'Invalid IssueID' });
      return;
    }

    const targetIssue = await IssueModel.findById(new Types.ObjectId(issueId));
    if (!targetIssue) {
      res
        .status(404)
        .json({ error: true, message: `Can't find issue with ID ${issueId}` });
      return;
    }

    const targetProject = await ProjectModel.findById(targetIssue.project);
    const targetProjectColumns = targetProject!.columns.map(
      (column) => column.title
    );

    if (!targetProjectColumns.includes(targetColumn)) {
      res
        .status(400)
        .json({
          error: true,
          message: `There is not such column as "${targetColumn}" in "${targetProject!.name}" project`,
        });
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
