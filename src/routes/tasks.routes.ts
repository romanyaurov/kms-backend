import { Router } from 'express';
import { validateTaskToggle } from '../middlewares/toggle-task-validator.middleware';
import TaskController from '../controllers/task.controller';

const tasksRouter = Router();

/* 
TODO: валидировать пользователя
(только пользователь назначенный на этот Issue может переключать статус подзадачи,
либо администратор или модератор)
*/
// tasksRouter.put('/:taskId/toggle', validateTaskToggle, TaskController.toggle); 
/* TODO эндпоинт добавления task */

export default tasksRouter;
