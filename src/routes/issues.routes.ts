import { Router } from 'express';
import IssueController from '../controllers/issue.controller';
import { validateIssueCreation } from '../middlewares/create-issue-validator.middleware';
import { validateIssueMoving } from '../middlewares/move-issue-validator.middleware';
import { transformIssueCreation } from '../middlewares/create-issue-transformer.middleware';
import { validateIssuesGetting } from '../middlewares/get-issues-validator.middleware';
import { validateIssueDetails } from '../middlewares/issue-details-validator.middleware';

const issuesRouter = Router();

issuesRouter.get(
  '/:projectSlug',
  validateIssuesGetting,
  IssueController.getAllIssues
);
issuesRouter.get('/details/:issueId', validateIssueDetails, IssueController.getIssue)
// issuesRouter.post(
//   '/',
//   validateIssueCreation,
//   transformIssueCreation,
//   IssueController.createIssue
// );
issuesRouter.put('/:issueId', validateIssueMoving, IssueController.moveIssue);
/* TODO добавить эндпоинт получения конкретного Issue */
/* TODO Добавить эндпоинт изменения конкретного Issue */
/* TODO Добавить эндпоинт удаления Issue (не забыть менять order у остальных issue в этом столбце) */

export default issuesRouter;
