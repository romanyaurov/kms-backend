import { Types } from 'mongoose';
import { IIssue } from '../models/issue.model';

const moveIssue = (
  issueObj: IIssue,
  issuesArr: IIssue[],
  targetColumn: Types.ObjectId,
  targetOrder: number
): IIssue[] => {
  const oldColumn = issueObj.column;

  const updatedIssueObj = {
    ...issueObj,
    column: targetColumn,
    order: targetOrder,
  };

  if (!oldColumn.equals(targetColumn)) {
    issuesArr
      .filter((issue) => issue.column.equals(oldColumn))
      .sort((a, b) => a.order - b.order)
      .forEach((issue, index) => (issue.order = index + 1));
  }

  const newColIssues = issuesArr.filter(
    (issue) => issue.column === targetColumn
  );
  newColIssues.sort((a, b) => a.order - b.order);
  newColIssues.splice(targetOrder - 1, 0, issueObj);
  newColIssues.forEach((issue, index) => (issue.order = index + 1));

  return issuesArr;
};

export default moveIssue;
