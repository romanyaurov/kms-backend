import { Request, Response } from 'express';

const helloController = (req: Request, res: Response) => {
  res.json({ message: 'Hello, Kaban Management System' });
};

export default helloController;
