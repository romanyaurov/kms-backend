import { CreateProjectDataType } from '../services/project.service';

const generateNewProject = (projectData: CreateProjectDataType) => {
  return {
    ...projectData,
    columns: projectData.columns.map((column, index) => ({
      title: column,
      order: index + 1,
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export default generateNewProject;
