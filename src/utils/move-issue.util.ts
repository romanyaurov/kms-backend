import { Types } from 'mongoose';
import { IIssue } from '../models/issue.model';

const moveIssue = (
  issueObj: IIssue,
  issuesArr: IIssue[],
  targetColumn: Types.ObjectId,
  targetOrder: number
): IIssue[] => {
  const oldColumn = issueObj.column;

  issueObj.column = targetColumn;
  issueObj.order = targetOrder;

  let oldColIssues: IIssue[] = [];
  if (!(oldColumn as Types.ObjectId).equals(targetColumn as Types.ObjectId)) {
    oldColIssues = issuesArr.filter((issue) =>
      (issue.column as Types.ObjectId).equals(oldColumn as Types.ObjectId)
    );
    oldColIssues.sort((a, b) => a.order - b.order);
    oldColIssues.forEach((issue, index) => (issue.order = index + 1));
  }

  const newColIssues = issuesArr.filter((issue) =>
    (issue.column as Types.ObjectId).equals(targetColumn as Types.ObjectId)
  );

  newColIssues.splice(targetOrder - 1, 0, issueObj);
  newColIssues.forEach((issue, index) => (issue.order = index + 1));

  return [...oldColIssues, ...newColIssues];
};

export default moveIssue;
