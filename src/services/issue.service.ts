import { Types } from 'mongoose';
import IssueModel, { IIssue } from '../models/issue.model';
import generateNewIssue from '../utils/generate-new-issue.util';
import moveIssue from '../utils/move-issue.util';

export type AddIssueDataType = {
  title: string;
  description: string;
  assignedTo: string[];
  tasks: string[];
  project: string;
  column: number;
};

export type UpdateIssueDataType = {
  issueId: string;
  column: Types.ObjectId;
  order: number;
};

class IssueService {
  static async getAllIssues(projectId: string): Promise<IIssue[]> {
    if (!Types.ObjectId.isValid(projectId)) {
      throw new Error('Invalid project ID format');
    }

    const issues = await IssueModel.find({ project: projectId });

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

  static async addIssue(issueData: AddIssueDataType): Promise<IIssue> {
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

  static async updateIssue(issueData: UpdateIssueDataType): Promise<string> {
    if (!Types.ObjectId.isValid(issueData.issueId)) {
      throw new Error('Invalid user ID format');
    }

    if (!Types.ObjectId.isValid(issueData.column)) {
      throw new Error('Invalid colmn ID format');
    }

    const currIssue = await IssueModel.findById(issueData.issueId);
    if (!currIssue) throw new Error('Issue not found');

    const allIssues = await IssueModel.find({
      _id: { $ne: currIssue._id },
      project: currIssue.project,
      column: { $in: [currIssue.column, issueData.column] },
    });

    const issuesToUpdate = moveIssue(
      currIssue,
      allIssues,
      issueData.column,
      issueData.order
    );

    const savePromises = issuesToUpdate.map((issue) => issue.save());
    const savedIssues = await Promise.all(savePromises);

    if (!savedIssues) throw new Error('Error updating issues');

    return 'Issue moved successfully';
  }
}

export default IssueService;
