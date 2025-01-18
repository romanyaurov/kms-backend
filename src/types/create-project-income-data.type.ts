export type CreateProjectIncomeDataType = {
  name: string;
  columns: string[];
  participants?: string[];
};

export type CreateProjectDataType = CreateProjectIncomeDataType & {
  moderator: string;
};
