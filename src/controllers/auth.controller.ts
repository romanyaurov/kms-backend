import { Request, Response } from 'express';
import UserService from '../services/user.service';
import AuthService from '../services/auth.service';

class AuthController {
  static async register(req: Request, res: Response) {
    const { firstName, lastName, email, post, skills, password, avatar } =
      req.body;
    try {
      const message = await UserService.addUser({
        firstName,
        lastName,
        email,
        password,
        post,
        skills,
        avatar,
      });
      res.status(201).json({ error: false, message });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: true, message: (error as Error).message });
    }
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const { accessToken, refreshToken } = await AuthService.login({
        email,
        password,
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });

      res.status(200).json({ accessToken });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: true, message: (error as Error).message });
    }
  }

  static async refresh(req: Request, res: Response) {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      res.status(401).json({ error: true, message: 'Unauthorized' });
    }

    try {
      const { newAccessToken, newRefreshToken } =
        await AuthService.refresh(refreshToken);

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });

      res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: true, message: (error as Error).message });
    }
  }

  static async logout(req: Request, res: Response) {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      res.status(400).json({ error: true, message: 'No token provided' });
    }

    try {
      const message = await AuthService.logout(refreshToken);
      res.status(200).json({ error: false, message });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: true, message: (error as Error).message });
    }
  }
}

export default AuthController;
