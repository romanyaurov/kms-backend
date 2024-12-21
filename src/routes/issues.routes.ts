import { Router } from 'express';
import IssueController from '../controllers/issue.controller';
import { validateIssueCreation } from '../middlewares/create-issue-validator.middleware';
import { validateIssueMoving } from '../middlewares/move-issue-validator.middleware';

const issuesRouter = Router();

issuesRouter.get('/:projectId', IssueController.getAllIssues);
issuesRouter.post('/', validateIssueCreation, IssueController.createIssue);
issuesRouter.put('/:issueId', validateIssueMoving, IssueController.moveIssue);
/* TODO добавить эндпоинт получения конкретного Issue */
/* TODO Добавить эндпоинт изменения конкретного Issue */
/* TODO Добавить эндпоинт удаления Issue (не забыть менять order у остальных issue в этом столбце) */

export default issuesRouter;
