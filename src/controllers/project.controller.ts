import { Request, Response } from 'express';
import ProjectService from '../services/project.service';

class ProjectController {
  static async getAllProjects(req: Request, res: Response) {
    const userId = req.user as string;
    try {
      const projects = await ProjectService.getAllProjects(userId);
      res.status(200).json(projects);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: true, message: (error as Error).message });
    }
  }

  static async getProject(req: Request, res: Response) {
    const userId = req.user as string;
    try {
      const { slug } = req.params;
      const project = await ProjectService.getProject(userId, slug);
      res.status(200).json(project);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: true, message: (error as Error).message });
    }
  }

  static async createProject(req: Request, res: Response) {
    const userId = req.user as string;
    try {
      const { name, slug, participants, columns } = req.body;
      const newProject = await ProjectService.createProject({
        name,
        slug,
        participants,
        columns,
        moderator: userId,
      });
      res.status(201).json(newProject);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: true, message: (error as Error).message });
    }
  }

  static async deleteProject(req: Request, res: Response) {
    const userId = req.user as string;
    try {
      const { slug } = req.params;
      const message = await ProjectService.deleteProject(userId, slug);
      res.status(200).json({ error: false, message });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: true, message: (error as Error).message });
    }
  }
}

export default ProjectController;
