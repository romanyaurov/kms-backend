import { Request, Response, NextFunction } from 'express';
import ProjectModel from '../models/project.model';
import { Types } from 'mongoose';

export const validateIssuesGetting = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { projectSlug } = req.params;
    const user = new Types.ObjectId(req.user);

    const project = await ProjectModel.findOne({ slug: projectSlug });

    if (!project) {
      res.status(404).json({
        error: true,
        message: `Can not find project with slug ${projectSlug}`,
      });
      return;
    }

    if (!(project.participants as Types.ObjectId[]).includes(user)) {
      res.status(403).json({
        error: true,
        message: `You have no access to project ${projectSlug}`,
      });
      return;
    }

    req.projectId = project._id as string;

    next();
    return;
  } catch (error) {
    res.status(500).json({ error: true, message: 'Unknown error' });
    return;
  }
};
