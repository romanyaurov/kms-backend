import { Types } from 'mongoose';
import IssueModel from '../models/issue.model';

class TaskService {
  static async toggle(taskId: string): Promise<string> {
    const targetIssue = await IssueModel.findOne({ 'tasks._id': taskId });
    if (!targetIssue) throw new Error('Issue containing this task not found');

    const targetTask = targetIssue.tasks.find((task) =>
      (task._id as Types.ObjectId).equals(taskId)
    );
    if (!targetTask) throw new Error('Task not found in issue');

    targetTask.isCompleted = !targetTask.isCompleted;
    targetTask.updatedAt = new Date().toISOString();

    const updatedIssue = await targetIssue.save();
    if (!updatedIssue) throw new Error('Error saving updated issue');

    return 'Task toggled successfull';
  }
}

export default TaskService;
