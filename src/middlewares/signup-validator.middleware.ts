import { Request, Response, NextFunction } from 'express';
import { SignupIncomeDataType } from '../types/signup-income-data.type';

export const validateSignupRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, firstName, lastName, post, skills, avatar } =
      req.body.user as SignupIncomeDataType;

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

    if (!firstName || typeof firstName !== 'string') {
      res
        .status(400)
        .json({ error: true, message: 'Invalid "firstName" field' });
      return;
    }

    if (!lastName || typeof lastName !== 'string') {
      res
        .status(400)
        .json({ error: true, message: 'Invalid "lastName" field' });
      return;
    }

    if (post) {
      if (typeof post !== 'string') {
        res.status(400).json({ error: true, message: 'Invalid "post" field' });
        return;
      }
    }

    if (skills) {
      if (
        !Array.isArray(skills) ||
        !skills.every((skill) => typeof skill === 'string')
      ) {
        res
          .status(400)
          .json({ error: true, message: 'Invalid "skills" field' });
        return;
      }
    }

    
    if (avatar) {
      const base64Regex = /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/;

      if (typeof avatar !== 'string' || !base64Regex.test(avatar)) {
        res
          .status(400)
          .json({
            error: true,
            message: 'Invalid base64 string in "avatar" field',
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
