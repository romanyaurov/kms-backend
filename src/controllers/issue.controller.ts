import { Request, Response } from 'express';
import IssueService from '../services/issue.service';
import { CreateIssueIncomeDataType } from '../types/create-issue-income-data.type';

class IssueController {
  static async getAllIssues(req: Request, res: Response) {
    const projectId = req.projectId as string;
    try {
      const issues = await IssueService.getAllIssues(projectId);
      res.status(200).json(issues);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: true, message: (error as Error).message });
    }
  }

  static async getIssue(req: Request, res: Response) {
    const issueId = req.issueId as string;
    try {
      const issue = await IssueService.getIssue(issueId);
      res.status(200).json(issue);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: true, message: (error as Error).message });
    }
  }

  static async createIssue(req: Request, res: Response) {
    try {
      const newIssue = await IssueService.addIssue(req.body as CreateIssueIncomeDataType);
      res.status(201).json(newIssue);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: true, message: (error as Error).message });
    }
  }

  static async moveIssue(req: Request, res: Response) {
    try {
      const { issueId } = req.params;
      const { targetColumn, targetOrder } = req.body;
      const message = await IssueService.moveIssue({
        issueId,
        targetColumn,
        targetOrder,
      });
      res.status(200).json({ error: false, message });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: true, message: (error as Error).message });
    }
  }
}

export default IssueController;
