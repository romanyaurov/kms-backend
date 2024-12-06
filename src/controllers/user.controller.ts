import { Request, Response } from 'express';
import UserService from '../services/user.service';

class UserController {
  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  }

  static async getUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await UserService.getUser(id);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: 'Bad request' });
    }
  }

  static async createUser(req: Request, res: Response) {
    try {
      const { firstName, lastName, email, post, skills } = req.body;
      const newUser = await UserService.addUser({
        firstName,
        lastName,
        email,
        post,
        skills,
      });
      res.status(201).json(newUser);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: 'Invalid input data' });
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const message = await UserService.deleteUser(id);
      res.status(200).json({ error: false, message });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: true, message: 'Internal Server Error' });
    }
  }
}

export default UserController;
