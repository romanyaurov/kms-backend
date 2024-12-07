import { Router } from 'express';
import IssueController from '../controllers/issue.controller';

const issuesRouter = Router();

issuesRouter.get('/', IssueController.getAllIssues);
issuesRouter.get('/:id', IssueController.getIssue);
issuesRouter.post('/', IssueController.createIssue);
issuesRouter.delete('/:id', IssueController.deleteIssue);

export default issuesRouter;
