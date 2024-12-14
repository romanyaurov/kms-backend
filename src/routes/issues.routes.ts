import { Router } from 'express';
import IssueController from '../controllers/issue.controller';

const issuesRouter = Router();

issuesRouter.get('/:projectId', IssueController.getAllIssues);
issuesRouter.get('/:issueId', IssueController.getIssue);
issuesRouter.post('/', IssueController.createIssue);
issuesRouter.patch('/:issueId', IssueController.updateIssue);
issuesRouter.delete('/:issueId', IssueController.deleteIssue);

export default issuesRouter;
