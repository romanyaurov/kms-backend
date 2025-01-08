import 'express';

declare global {
  namespace Express {
    interface Request {
      user?: string;
      projectId?: string;
      issueId?: string;
    }
  }
}
