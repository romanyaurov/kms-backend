import fs from 'fs/promises';
import path from 'path';
import UserModel from '../models/user.model';
import IssueModel from '../models/issue.model';
import ProjectModel from '../models/project.model';

type IssueType = {
  title: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  assignedTo: string[];
  tasks: { text: string; isCompleted: boolean }[];
  project: string;
  column: string;
  order: number;
};

const issuesMigrate = async () => {
  const users = await UserModel.find();
  const projects = await ProjectModel.find();

  const filePath = path.join(__dirname, '..', 'data', 'issues.json');
  const fileData = await fs.readFile(filePath, 'utf-8');
  const rawIssues = JSON.parse(fileData) as IssueType[];

  if (!Array.isArray(rawIssues)) {
    throw new Error('Invalid data format in issues.json. Expacted an array.');
  }

  const issuesToInsert = rawIssues.map((issue) => ({
    ...issue,
    assignedTo: issue.assignedTo.map(
      (assignedUserEmail: string) =>
        users.find((user) => user.email === assignedUserEmail)?._id
    ),
    project: projects.find((project) => project.name === issue.project)?._id,
    column: projects
      .find((project) => project.name === issue.project)
      ?.columns.find((column) => column.title === issue.column)?._id,
  }));

  await IssueModel.deleteMany({});
  console.log('Existing issues cleared.');

  const result = await IssueModel.insertMany(issuesToInsert);
  console.log(`Migrated ${result.length} issues to MongoDB`);
};

export default issuesMigrate;
