import { Types } from 'mongoose';
import IssueModel, { IIssue } from '../models/issue.model';
import moveIssue from '../utils/move-issue.util';
import { CreateIssueIncomeDataType } from '../types/create-issue-income-data.type';
import { MoveIssueIncomeDataType } from '../types/move-issue-income-data.type';
import { IssueDTO } from '../dtos/issue.dto';
import ProjectModel from '../models/project.model';
import { IUser } from '../models/user.model';

class IssueService {
  static async getAllIssues(projectId: string): Promise<IssueDTO[]> {
    const projectObjectId = new Types.ObjectId(projectId);

    const issues = await IssueModel.find({
      project: projectObjectId,
    }).populate<{
      assignedTo: {
        _id: Types.ObjectId;
        firstName: string;
        lastName: string;
        post: string;
        email: string;
        avatar: string;
      }[];
      tasks: { _id: Types.ObjectId; text: string; isCompleted: boolean }[];
    }>([
      {
        path: 'assignedTo',
        select: 'firstName lastName post email avatar',
      },
      {
        path: 'tasks',
        select: 'text isCompleted',
      },
    ]);

    if (!issues) throw new Error('Error fetching issues');

    return issues.map((issue) => new IssueDTO(issue));
  }

  static async getIssue(issueId: string): Promise<IssueDTO> {
    if (!Types.ObjectId.isValid(issueId)) {
      throw new Error('Invalid user ID format');
    }

    const issue = await IssueModel.findById(issueId).populate<{
      assignedTo: {
        _id: Types.ObjectId;
        firstName: string;
        lastName: string;
        post: string;
        email: string;
        avatar: string;
      }[];
      tasks: { _id: Types.ObjectId; text: string; isCompleted: boolean }[];
    }>([
      {
        path: 'assignedTo',
        select: 'firstName lastName post email avatar',
      },
      {
        path: 'tasks',
        select: 'text isCompleted',
      },
    ]);

    if (!issue) throw new Error('Issue not found');

    return new IssueDTO(issue);
  }

  static async addIssue(issueData: CreateIssueIncomeDataType): Promise<string> {
    const targetProject = await ProjectModel.findOne({
      slug: issueData.project,
    }).populate<{ participants: { _id: string; email: string }[] }>({
      path: 'participants',
      select: 'email',
    });

    const newIssue = new IssueModel({
      ...issueData,
      project: targetProject!._id,
      assignedTo: issueData.assignedTo?.map(
        (userEmail) =>
          targetProject!.participants.find(
            (participant) => participant.email === userEmail
          )!._id
      ) || [],
      tasks: issueData.tasks?.map((task) => ({
        text: task,
        isCompleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })) || [],
      order: (await IssueModel.countDocuments({
        project: targetProject!._id,
        column: issueData.column,
      })) + 1,
    });

    const savedIssue = newIssue.save();

    if (!savedIssue) throw new Error('Error adding issue');

    return 'Issue created successfully';
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
