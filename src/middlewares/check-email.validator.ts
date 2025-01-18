import { Request, Response, NextFunction } from 'express';
import ProjectModel from '../models/project.model';
import { Types } from 'mongoose';

export const checkEmailValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body as { email: string };
    
    if (!email) {
      res.status(400).json({
        error: true,
        message: 'There are not email in request body',
      });
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      res.status(400).json({
        error: true,
        message: 'Invalid email',
      });
      return;
    }

    next();
    return;
  } catch (error) {
    res.status(500).json({ error: true, message: 'Unknown error' });
    return;
  }
};
