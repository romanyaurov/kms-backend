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
    const projectId = req.projectId as string;
    try {
      const project = await ProjectService.getProject(projectId);
      res.status(200).json(project);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: true, message: (error as Error).message });
    }
  }

  static async createProject(req: Request, res: Response) {
    const userId = req.user as string;
    try {
      const { name, participants, columns } = req.body;
      const message = await ProjectService.createProject({
        name,
        participants,
        columns,
        moderator: userId,
      });
      res.status(201).json({ error: false, message });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: true, message: (error as Error).message });
    }
  }

  // static async deleteProject(req: Request, res: Response) {
  //   const userId = req.user as string;
  //   try {
  //     const { slug } = req.params;
  //     const message = await ProjectService.deleteProject(userId, slug);
  //     res.status(200).json({ error: false, message });
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).json({ error: true, message: (error as Error).message });
  //   }
  // }
}

export default ProjectController;
