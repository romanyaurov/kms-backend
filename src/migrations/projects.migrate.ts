import fs from 'fs/promises';
import path from 'path';
import UserModel from '../models/user.model';
import ProjectModel from '../models/project.model';
import { slugify } from 'transliteration';

type ProjectType = {
  name: string;
  createdAt: string;
  updatedAt: string;
  moderator: string;
  participants: string[];
  columns: { title: string; order: number }[];
};

const projectsMigrate = async () => {
  const users = await UserModel.find();

  const filePath = path.join(__dirname, '..', 'data', 'projects.json');
  const fileData = await fs.readFile(filePath, 'utf-8');
  const rawProjects = JSON.parse(fileData) as ProjectType[];

  if (!Array.isArray(rawProjects)) {
    throw new Error('Invalid data format in projects.json. Expected an array.');
  }

  const projectsToInsert = rawProjects.map((project) => ({
    ...project,
    participants: project.participants.map(
      (participant) => users.find((user) => user.email === participant)?._id
    ),
    moderator: users.find((user) => user.email === project.moderator)?._id,
    slug: slugify(project.name)
  }));

  await ProjectModel.deleteMany({});
  console.log('Existing projects cleared.');

  const result = await ProjectModel.insertMany(projectsToInsert);
  console.log(`Migrated ${result.length} projects to MongoDB`);
};

export default projectsMigrate;
