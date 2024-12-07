import IssueModel from '../models/issue.model';
import { addIssueDataType } from '../services/issue.service';

const generateNewIssue = async (issueData: addIssueDataType) => {
  const createdAt = new Date().toISOString();
  const updatedAt = new Date().toISOString();
  const sameColumnIssues = await IssueModel.find({
    project: issueData.project,
    column: issueData.column,
  });
  const order = sameColumnIssues.length + 1;

  return {
    ...issueData,
    createdAt,
    updatedAt,
    order,
    tasks: issueData.tasks.map((task) => ({ text: task, isCompleted: false })),
  };
};

export default generateNewIssue;
