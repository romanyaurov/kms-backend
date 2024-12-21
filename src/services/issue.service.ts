import { Types } from 'mongoose';
import IssueModel, { IIssue } from '../models/issue.model';
import moveIssue from '../utils/move-issue.util';
import { CreateIssueIncomeDataType } from '../types/create-issue-income-data.type';
import { MoveIssueIncomeDataType } from '../types/move-issue-income-data.type';
import ProjectModel from '../models/project.model';

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
    const newIssue = new IssueModel(issueData);

    const savedIssue = newIssue.save();

    if (!savedIssue) throw new Error('Error adding issue');

    return savedIssue;
  }

  static async moveIssue(
    issueData: MoveIssueIncomeDataType & { issueId: string }
  ): Promise<string> {
    if (!Types.ObjectId.isValid(issueData.issueId)) {
      throw new Error('Invalid user ID format');
    }

    if (!Types.ObjectId.isValid(issueData.targetColumn)) {
      throw new Error('Invalid colmn ID format');
    }

    const columnObjectId = new Types.ObjectId(issueData.targetColumn);

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
      issueData.targetOrder
    );

    const savePromises = issuesToUpdate.map((issue) => issue.save());
    const savedIssues = await Promise.all(savePromises);

    if (!savedIssues) throw new Error('Error updating issues');

    return 'Issue moved successfully';
  }
}

export default IssueService;
