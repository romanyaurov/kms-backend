import mongoose, { Types } from 'mongoose';
import { slugify } from 'transliteration';
import { v4 as uuidv4 } from 'uuid';
import ProjectModel, { IProject } from '../models/project.model';
import { CreateProjectDataType } from '../types/create-project-income-data.type';
import UserModel from '../models/user.model';
import { ProjectDTO } from '../dtos/project.dto';

class ProjectService {
  static async getAllProjects(userId: string): Promise<ProjectDTO[]> {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const projects = await ProjectModel.find({
      participants: { $in: [userObjectId] },
    }).populate<{
      moderator: {
        _id: Types.ObjectId;
        firstName: string;
        lastName: string;
        email: string;
        avatar: string;
      };
      participants: { _id: Types.ObjectId; email: string; avatar: string }[];
    }>([
      {
        path: 'moderator',
        select: 'firstName lastName email avatar',
      },
      {
        path: 'participants',
        select: 'email avatar',
      },
    ]);

    if (!projects) {
      throw new Error('Error fetching projects');
    }

    return projects.map((project) => new ProjectDTO(project));
  }

  static async getProject(projectId: string): Promise<ProjectDTO> {
    const projectObjectId = new mongoose.Types.ObjectId(projectId);

    const project = await ProjectModel.findById(projectObjectId).populate<{
      moderator: {
        _id: Types.ObjectId;
        firstName: string;
        lastName: string;
        email: string;
        avatar: string;
      };
      participants: { _id: Types.ObjectId; email: string; avatar: string }[];
    }>([
      {
        path: 'moderator',
        select: 'email firstName lastName avatar',
      },
      {
        path: 'participants',
        select: 'email avatar',
      },
    ]);

    if (!project) throw new Error('Project not found');

    return new ProjectDTO(project);
  }

  static async createProject(
    projectData: CreateProjectDataType
  ): Promise<string> {
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
      slug: slugify(projectData.name) + '-' + uuidv4().slice(0, 8),
      moderator: new mongoose.Types.ObjectId(projectData.moderator),
      participants: [
        new mongoose.Types.ObjectId(projectData.moderator),
        ...participants,
      ],
      columns: projectData.columns.map((column, index) => ({
        title: column,
        slug: slugify(column) + '-' + uuidv4().slice(0, 8),
        order: index + 1,
      })),
    });

    const savedProject = await newProject.save();

    if (!savedProject) {
      throw new Error('Error creating project');
    }

    return savedProject.slug;
  }

  // static async deleteProject(userId: string, slug: string): Promise<string> {
  //   const project = await ProjectModel.findOne({ slug });

  //   if (!project) throw new Error('Project not found');

  //   if (!project.moderator.equals(userId)) {
  //     throw new Error('Only moderator can delete project');
  //   }

  //   return `Project with ID ${project._id} has been deleted successfully.`;
  // }
}

export default ProjectService;
