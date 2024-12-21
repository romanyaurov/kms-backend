export type CreateIssueIncomeDataType = {
  title: string;
  description: string;
  assignedTo?: string[];
  tasks?: string[];
  deadline?: string;
  project: string;
  column: string;
};