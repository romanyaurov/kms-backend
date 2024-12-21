import { Request, Response } from 'express';
import TaskService from '../services/task.service';

class TaskController {
  static async toggle(req: Request, res: Response) {
    const { taskId } = req.params as { taskId: string };
    try {
      const message = await TaskService.toggle(taskId);
      res.status(200).json({ error: false, message });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: true, message: (error as Error).message });
    }
  }
}

export default TaskController;
