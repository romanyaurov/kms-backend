import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import IssueModel from '../models/issue.model';

export const validateIssueDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { issueId } = req.params;
    
    if (!issueId) {
      res.status(400).json({ error: true, message: 'Need an Issue ID' });
      return;
    }

    if (!Types.ObjectId.isValid(issueId)) {
      res.status(400).json({ error: true, message: 'Invalid Issue ID' });
      return;
    }

    const issue = await IssueModel.findById(issueId);

    if (!issue) {
      res.status(404).json({
        error: true,
        message: `Can not find issue with id ${issueId}`,
      });
      return;
    }

    req.issueId = issueId;

    next();
    return;
  } catch (error) {
    res.status(500).json({ error: true, message: 'Unknown error' });
    return;
  }
};
