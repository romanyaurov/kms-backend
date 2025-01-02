import { Router } from 'express';
import ProjectController from '../controllers/project.controller';
import { validateProjectCreation } from '../middlewares/create-project-validator.middleware';
import { validateIssuesGetting } from '../middlewares/get-issues-validator.middleware';

const projectsRouter = Router();

projectsRouter.get('/', ProjectController.getAllProjects);
projectsRouter.get(
  '/:projectSlug',
  validateIssuesGetting,
  ProjectController.getProject
);
projectsRouter.post(
  '/',
  validateProjectCreation,
  ProjectController.createProject
);
// projectsRouter.delete('/:slug', ProjectController.deleteProject);

export default projectsRouter;
