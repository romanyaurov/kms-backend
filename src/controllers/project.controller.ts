import { Request, Response } from 'express';
import ProjectService from '../services/project.service';

class ProjectController {
  static async getAllProjects(req: Request, res: Response) {
    try {
      const projects = await ProjectService.getAllProjects();
      res.status(200).json(projects);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: true, message: (error as Error).message });
    }
  }

  static async getProject(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const project = await ProjectService.getProject(id);
      res.status(200).json(project);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: true, message: (error as Error).message });
    }
  }

  static async createProject(req: Request, res: Response) {
    try {
      const { name, moderator, columns } = req.body;
      const newProject = await ProjectService.createProject({
        name,
        moderator,
        columns,
      });
      res.status(201).json(newProject);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: true, message: (error as Error).message });
    }
  }

  static async deleteProject(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const message = await ProjectService.deleteProject(id);
      res.status(200).json({ error: false, message });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: true, message: (error as Error).message });
    }
  }
}

export default ProjectController;
