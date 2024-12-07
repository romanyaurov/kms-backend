import { Types } from 'mongoose';
import IssueModel, { IIssue } from '../models/issue.model';
import generateNewIssue from '../utils/generate-new-issue.util';

export type addIssueDataType = {
  title: string;
  description: string;
  assignedTo: string[];
  tasks: string[];
  project: string;
  column: number;
};

class IssueService {
  static async getAllIssues(): Promise<IIssue[]> {
    const issues = await IssueModel.find();

    if (!issues) throw new Error('Error fetching issues');

    return issues;
  }

  static async getIssue(issueId: string): Promise<IIssue> {
    if (!Types.ObjectId.isValid(issueId)) {
      throw new Error('Invalid user ID format');
    }

    const issue = await IssueModel.findById(issueId);

    if (!issue) throw new Error('Issue not found');

    return issue;
  }

  static async addIssue(issueData: addIssueDataType): Promise<IIssue> {
    const fullIssueData = await generateNewIssue(issueData);

    const newIssue = new IssueModel(fullIssueData);
    const savedIssue = newIssue.save();

    if (!savedIssue) throw new Error('Error adding issue');

    return savedIssue;
  }

  static async deleteIssue(issueId: string): Promise<string> {
    if (!Types.ObjectId.isValid(issueId)) {
      throw new Error('Invalid user ID format');
    }

    const result = await IssueModel.findByIdAndDelete(issueId);

    if (!result) throw new Error('Issue not found');

    return `Issue with ID ${issueId} has been deleted successfully.`;
  }
}

export default IssueService;
