import { Types } from 'mongoose';
import IssueModel, { IIssue } from '../models/issue.model';
import moveIssue from '../utils/move-issue.util';
import { CreateIssueIncomeDataType } from '../types/create-issue-income-data.type';
import { MoveIssueIncomeDataType } from '../types/move-issue-income-data.type';
import { IssueDTO } from '../dtos/issue.dto';

class IssueService {
  static async getAllIssues(projectId: string): Promise<IssueDTO[]> {
    const projectObjectId = new Types.ObjectId(projectId);

    const issues = await IssueModel.find({
      project: projectObjectId,
    }).populate<{
      assignedTo: { _id: Types.ObjectId; email: string; avatar: string }[];
      tasks: { _id: Types.ObjectId; text: string; isCompleted: boolean }[];
    }>([
      {
        path: 'assignedTo',
        select: 'email avatar',
      },
      {
        path: 'tasks',
        select: 'text isCompleted',
      },
    ]);

    if (!issues) throw new Error('Error fetching issues');

    return issues.map((issue) => new IssueDTO(issue));
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

    /* define target issue id & find issue object */
    const issueObjectId = new Types.ObjectId(issueData.issueId);
    const targetIssue = await IssueModel.findById(issueObjectId);

    /* find all issues assiciated with previous and new columns */
    const allIssues = await IssueModel.find({
      _id: { $ne: targetIssue!._id }, // exclude target issue
      project: targetIssue!.project,
      column: { $in: [targetIssue!.column, issueData.targetColumn] },
    });

    /* reorder issues in finded columns */
    const issuesToUpdate = moveIssue(
      targetIssue!,
      allIssues,
      issueData.targetColumn,
      issueData.targetOrder
    );

    /* save changes in database */
    const savePromises = issuesToUpdate.map((issue) => issue.save());
    const savedIssues = await Promise.all(savePromises);

    if (!savedIssues) throw new Error('Error updating issues');

    return 'Issue moved successfully';
  }
}

export default IssueService;
