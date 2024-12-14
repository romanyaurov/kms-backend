import { Request, Response } from 'express';
import IssueService from '../services/issue.service';

class IssueController {
  static async getAllIssues(req: Request, res: Response) {
    try {
      const { projectId } = req.params;
      const issues = await IssueService.getAllIssues(projectId);
      res.status(200).json(issues);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: true, message: (error as Error).message });
    }
  }

  static async getIssue(req: Request, res: Response) {
    try {
      const { issueId } = req.params;
      const issue = await IssueService.getIssue(issueId);
      res.status(200).json(issue);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: true, message: (error as Error).message });
    }
  }

  static async createIssue(req: Request, res: Response) {
    try {
      const { title, description, assignedTo, tasks, project, column } =
        req.body;
      const newIssue = await IssueService.addIssue({
        title,
        description,
        assignedTo,
        tasks,
        project,
        column,
      });
      res.status(201).json(newIssue);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: true, message: (error as Error).message });
    }
  }

  static async deleteIssue(req: Request, res: Response) {
    try {
      const { issueId } = req.params;
      const message = await IssueService.deleteIssue(issueId);
      res.status(200).json({ error: false, message });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: true, message: (error as Error).message });
    }
  }

  static async updateIssue(req: Request, res: Response) {
    try {
      const { issueId } = req.params;
      const { column, order } = req.body;
      const message = await IssueService.updateIssue({ issueId, column, order });
      res.status(200).json({ error: false, message });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: true, message: (error as Error).message });
    }
  }
}

export default IssueController;
