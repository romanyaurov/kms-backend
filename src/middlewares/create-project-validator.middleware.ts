import { Request, Response, NextFunction } from 'express';

import { CreateProjectIncomeDataType } from '../types/create-project-income-data.type';
import UserModel from '../models/user.model';

export const validateProjectCreation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, columns, participants } =
      req.body as CreateProjectIncomeDataType;

    if (!name || typeof name !== 'string') {
      res.status(400).json({ error: true, message: 'Invalid project name' });
      return;
    }

    if (
      !columns ||
      !Array.isArray(columns) ||
      columns.length < 2 ||
      !columns.every((column) => typeof column === 'string')
    ) {
      res
        .status(400)
        .json({ error: true, message: 'columns must be an array of strings' });
    }

    if (participants && participants.length > 0) {
      if (
        !Array.isArray(participants) ||
        !participants.every((participant) => typeof participant === 'string')
      ) {
        res.status(400).json({
          error: true,
          message: 'participants must be an array of strings',
        });
        return;
      }

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      const invalidParticipantsEmails = participants.filter(
        (participant) => !emailRegex.test(participant)
      );

      if (invalidParticipantsEmails && invalidParticipantsEmails.length > 0) {
        res.status(400).json({
          error: true,
          message: `Invalid email(s): ${invalidParticipantsEmails.join(', ')}`,
        });
        return;
      }

      const existingUsers = await UserModel.find(
        { email: { $in: participants } },
        { email: 1 }
      );

      const existingEmails = existingUsers.map((user) => user.email);

      const missingEmails = participants.filter(
        (participant) => !existingEmails.includes(participant)
      );

      if (missingEmails && missingEmails.length > 0) {
        res.status(404).json({
          error: true,
          message: `Not registered users: ${missingEmails.join(', ')}`,
        });
        return;
      }
    }

    next();
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: true, message: 'Unknown internal server error' });
  }
};
