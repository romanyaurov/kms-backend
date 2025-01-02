import { IIssue } from '../models/issue.model';

const moveIssue = (
  issueObj: IIssue,
  issuesArr: IIssue[],
  targetColumn: string,
  targetOrder: number
): IIssue[] => {
  /* Save Previous Column */
  const oldColumn = issueObj.column;

  /* Overwrite Column & Order in Target Issue */
  issueObj.column = targetColumn;
  issueObj.order = targetOrder;

  /* new column not equals prev column ? reorder issues in prev column : [] */
  let oldColIssues: IIssue[] = [];
  if (oldColumn !== targetColumn) {
    oldColIssues = issuesArr.filter((issue) => issue.column === oldColumn);
    oldColIssues.sort((a, b) => a.order - b.order);
    oldColIssues.forEach((issue, index) => (issue.order = index + 1));
  }

  /* define new column */
  const newColIssues = issuesArr.filter((issue) => issue.column === targetColumn);

  /* paste target issue into new column & reorder new column */
  newColIssues.splice(targetOrder - 1, 0, issueObj);
  newColIssues.forEach((issue, index) => (issue.order = index + 1));

  /* return reordered prev column if exist & reordered new column */
  return [...oldColIssues, ...newColIssues];
};

export default moveIssue;
