import mongoose, { mongo, Types } from 'mongoose';
import ProjectModel, { IProject } from '../models/project.model';
import { CreateProjectDataType } from '../types/create-project-income-data.type';
import UserModel from '../models/user.model';
import { slugify } from 'transliteration';

class ProjectService {
  static async getAllProjects(userId: string): Promise<IProject[]> {
    const participantId = new mongoose.Types.ObjectId(userId);

    const projects = await ProjectModel.find({
      participants: { $in: [participantId] },
    });

    if (!projects) {
      throw new Error('Error fetching projects');
    }

    return projects;
  }

  static async getProject(userId: string, slug: string): Promise<IProject> {
    const participantId = new mongoose.Types.ObjectId(userId);

    const project = await ProjectModel.findOne({
      slug,
      participants: { $in: [participantId] },
    });

    if (!project) throw new Error('Project not found');

    return project;
  }

  static async createProject(
    projectData: CreateProjectDataType
  ): Promise<IProject> {
    const participants = projectData.participants
      ? await Promise.all(
          projectData.participants.map(async (participant) => {
            const user = await UserModel.findOne({ email: participant });
            return user?._id;
          })
        )
      : [];

    const newProject = new ProjectModel({
      ...projectData,
      moderator: new mongoose.Types.ObjectId(projectData.moderator),
      participants: [
        new mongoose.Types.ObjectId(projectData.moderator),
        ...participants,
      ],
      columns: projectData.columns.map((column, index) => ({
        title: column,
        order: index + 1,
      })),
    });

    const savedProject = await newProject.save();

    if (!savedProject) {
      throw new Error('Error creating project');
    }

    return savedProject;
  }

  static async deleteProject(userId: string, slug: string): Promise<string> {
    const project = await ProjectModel.findOne({ slug });

    if (!project) throw new Error('Project not found');

    if (!project.moderator.equals(userId)) {
      throw new Error('Only moderator can delete project');
    }

    return `Project with ID ${project._id} has been deleted successfully.`;
  }
}

export default ProjectService;
