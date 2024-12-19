import { Request, Response, NextFunction } from 'express';
import { LoginIncomeDataType } from '../types/login-income-data.type';

export const validateLoginRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body as LoginIncomeDataType;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
      res.status(400).json({ error: true, message: 'Invalid email' });
      return;
    }

    const passRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;

    if (
      !password ||
      typeof password !== 'string' ||
      !passRegex.test(password)
    ) {
      res.status(400).json({ error: true, message: 'Invalid password' });
      return;
    }

    next();
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: true, message: 'Unknown internal server error' });
  }
};
