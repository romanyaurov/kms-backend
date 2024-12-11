import { Router } from 'express';
import IssueController from '../controllers/issue.controller';

const issuesRouter = Router();

issuesRouter.get('/', IssueController.getAllIssues);
issuesRouter.get('/:id', IssueController.getIssue);
issuesRouter.post('/', IssueController.createIssue);
issuesRouter.patch('/:id', IssueController.updateIssue);
issuesRouter.delete('/:id', IssueController.deleteIssue);

export default issuesRouter;
