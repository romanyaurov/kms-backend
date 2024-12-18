import { Router } from 'express';
import ProjectController from '../controllers/project.controller';
import { validateProjectCreation } from '../middlewares/create-project-validator.middleware';

const projectsRouter = Router();

projectsRouter.get('/', ProjectController.getAllProjects);
projectsRouter.get('/:slug', ProjectController.getProject);
projectsRouter.post('/', validateProjectCreation, ProjectController.createProject);
projectsRouter.delete('/:slug', ProjectController.deleteProject);

export default projectsRouter;
