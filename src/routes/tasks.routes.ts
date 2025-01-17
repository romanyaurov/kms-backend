import { Router } from 'express';
import { validateTaskToggle } from '../middlewares/toggle-task-validator.middleware';
import TaskController from '../controllers/task.controller';

const tasksRouter = Router();

tasksRouter.post('/:taskId', validateTaskToggle, TaskController.toggle); 
/* TODO эндпоинт добавления task */

export default tasksRouter;
