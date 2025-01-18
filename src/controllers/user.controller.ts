import { Request, Response } from 'express';
import UserService from '../services/user.service';

class UserController {
  // static async getAllUsers(req: Request, res: Response) {
  //   const userId = req.user as string;
  //   try {
  //     const users = await UserService.getAllUsers(userId);
  //     res.status(200).json(users);
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).json({ error: true, message: (error as Error).message });
  //   }
  // }

  static async getUserInfo(req: Request, res: Response) {
    const userId = req.user as string;
    try {
      const user = await UserService.getUserInfo(userId);
      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: true, message: (error as Error).message });
    }
  }

  static async checkUser(req: Request, res: Response) {
    const { email } = req.body as { email: string };
    try {
      const { status, message } = await UserService.checkUserEmail(email);
      res.status(status).json({ error: !!(status !== 200), message })
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: true, message: (error as Error).message })
    }
  }
}

export default UserController;
