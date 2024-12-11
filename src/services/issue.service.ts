import { Types } from 'mongoose';
import IssueModel, { IIssue } from '../models/issue.model';
import generateNewIssue from '../utils/generate-new-issue.util';
import updateIssues from '../utils/update-issues.util';

export type AddIssueDataType = {
  title: string;
  description: string;
  assignedTo: string[];
  tasks: string[];
  project: string;
  column: number;
};

export type UpdateIssueDataType = {
  id: string;
  column: string;
  order: number;
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
    if (!Types.ObjectId.isValid(issueData.id)) {
      throw new Error('Invalid user ID format');
    }

    const currIssue = await IssueModel.findById(issueData.id);
    if (!currIssue) throw new Error('Issue not found');

    const issuesToUpdate = [];

    if (currIssue.column === issueData.column) {
      const issues = await IssueModel.find({
        _id: { $ne: currIssue._id },
        project: currIssue.project,
        column: currIssue.column,
      });

      currIssue.order = issueData.order;

      issues.sort((issueA, issueB) => issueA.order - issueB.order);
      issues.splice(currIssue.order - 1, 0, currIssue);
      issues.forEach((issue, index) => (issue.order = index + 1));

      issuesToUpdate.push(...issues);
    } else if (issueData.order === 1) {
      const issues = await IssueModel.find({
        _id: { $ne: currIssue._id },
        project: currIssue.project,
        column: currIssue.column,
      });

      currIssue.order = issueData.order;
      currIssue.column = issueData.column;

      issues.sort((issueA, issueB) => issueA.order - issueB.order);
      issues.forEach((issue, index) => (issue.order = index + 1));

      issuesToUpdate.push(...issues, currIssue);
    } else {
      const prevColIssues = await IssueModel.find({
        _id: { $ne: currIssue._id },
        project: currIssue.project,
        column: currIssue.column,
      });

      prevColIssues.sort((issueA, issueB) => issueA.order - issueB.order);
      prevColIssues.forEach((issue, index) => (issue.order = index + 1));

      const newColIssues = await IssueModel.find({
        project: currIssue.project,
        column: issueData.column,
      });

      currIssue.order = issueData.order;
      currIssue.column = issueData.column;

      newColIssues.sort((issueA, issueB) => issueA.order - issueB.order);
      newColIssues.splice(currIssue.order - 1, 0, currIssue);
      newColIssues.forEach((issue, index) => (issue.order = index + 1));

      issuesToUpdate.push(...prevColIssues, ...newColIssues);
    }

    const savePromises = issuesToUpdate.map((issue) => issue.save());
    const savedIssues = await Promise.all(savePromises);

    if (!savedIssues) throw new Error('Error updating issues');

    return 'Issues updated successfully';
  }
}

export default IssueService;
