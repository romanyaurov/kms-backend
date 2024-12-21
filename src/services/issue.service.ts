import { Types } from 'mongoose';
import IssueModel, { IIssue } from '../models/issue.model';
import generateNewIssue from '../utils/generate-new-issue.util';
import moveIssue from '../utils/move-issue.util';
import { CreateIssueIncomeDataType } from '../types/create-issue-income-data.type';
import { MoveIssueIncomeDataType } from '../types/move-issue-income-data.type';

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

  static async addIssue(issueData: CreateIssueIncomeDataType): Promise<IIssue> {
    const fullIssueData = await generateNewIssue(issueData);

    const newIssue = new IssueModel(fullIssueData);
    const savedIssue = newIssue.save();

    if (!savedIssue) throw new Error('Error adding issue');

    return savedIssue;
  }

  static async moveIssue(issueData: MoveIssueIncomeDataType): Promise<string> {
    if (!Types.ObjectId.isValid(issueData.issueId)) {
      throw new Error('Invalid user ID format');
    }

    if (!Types.ObjectId.isValid(issueData.column)) {
      throw new Error('Invalid colmn ID format');
    }

    const columnObjectId = new Types.ObjectId(issueData.column)

    const targetIssue = await IssueModel.findById(issueData.issueId);
    if (!targetIssue) throw new Error('Issue not found');

    const allIssues = await IssueModel.find({
      _id: { $ne: targetIssue._id },
      project: targetIssue.project,
      column: { $in: [targetIssue.column, columnObjectId] },
    });

    const issuesToUpdate = moveIssue(
      targetIssue,
      allIssues,
      columnObjectId,
      issueData.order
    );

    const savePromises = issuesToUpdate.map((issue) => issue.save());
    const savedIssues = await Promise.all(savePromises);

    if (!savedIssues) throw new Error('Error updating issues');

    return 'Issue moved successfully';
  }
}

export default IssueService;
