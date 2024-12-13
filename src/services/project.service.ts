import { Types } from 'mongoose';
import ProjectModel, { IProject } from '../models/project.model';
import generateNewProject from '../utils/generate-new-project.util';

export type CreateProjectDataType = {
  name: string;
  moderator: string;
  columns: string[];
};

class ProjectService {
  static async getAllProjects(): Promise<IProject[]> {
    const projects = await ProjectModel.find();

    if (!projects) {
      throw new Error('Error fetching projects');
    }

    return projects;
  }

  static async getProject(projectId: string): Promise<IProject> {
    if (!Types.ObjectId.isValid(projectId)) {
      throw new Error('Invalid project ID format');
    }

    const project = await ProjectModel.findById(projectId);

    if (!project) throw new Error('Project not found');

    return project;
  }

  static async createProject(
    projectData: CreateProjectDataType
  ): Promise<IProject> {
    const fullProjectData = generateNewProject(projectData);

    const newProject = new ProjectModel(fullProjectData);
    const savedProject = await newProject.save();

    if (!savedProject) {
      throw new Error('Error creating project');
    }

    return savedProject;
  }

  static async deleteProject(projectId: string): Promise<string> {
    if (!Types.ObjectId.isValid(projectId)) {
      throw new Error('Invalid project ID format');
    }

    const result = await ProjectModel.findByIdAndDelete(projectId);

    if (!result) throw new Error('Project not found');

    return `Project with ID ${projectId} has been deleted successfully.`;
  }
}

export default ProjectService;
