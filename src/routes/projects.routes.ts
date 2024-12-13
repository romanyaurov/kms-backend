import { Router } from 'express';
import ProjectController from '../controllers/project.controller';

const projectsRouter = Router();

projectsRouter.get('/', ProjectController.getAllProjects);
projectsRouter.get('/:id', ProjectController.getProject);
projectsRouter.post('/', ProjectController.createProject);
projectsRouter.delete('/:id', ProjectController.deleteProject);

export default projectsRouter;
