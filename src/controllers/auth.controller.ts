import { Request, Response } from 'express';
import UserService from '../services/user.service';
import AuthService from '../services/auth.service';

class AuthController {
  static async userInfo(req: Request, res: Response) {
    const userId = req.user as string;
    try {
      const userInfo = await UserService.getUserInfo(userId);
      res.status(200).json({ user: { ...userInfo } });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: true, message: (error as Error).message });
    }
  }

  static async register(req: Request, res: Response) {
    const { firstName, lastName, email, post, skills, password, avatar } =
      req.body.user;
    try {
      const { accessToken, refreshToken, userAvatar } =
        await UserService.addUser({
          firstName,
          lastName,
          email,
          password,
          post,
          skills,
          avatar,
        });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });

      res.status(201).json({
        user: {
          firstName,
          lastName,
          email,
          avatar: userAvatar,
        },
        accessToken,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: true, message: (error as Error).message });
    }
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const { user, accessToken, refreshToken } = await AuthService.login({
        email,
        password,
      });

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });

      res.status(200).json({ user });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: true, message: (error as Error).message });
    }
  }

  // static async refresh(req: Request, res: Response) {
  //   const { refreshToken } = req.cookies;

  //   if (!refreshToken) {
  //     res.status(401).json({ error: true, message: 'Unauthorized' });
  //   }

  //   try {
  //     const { newAccessToken, newRefreshToken } =
  //       await AuthService.refresh(refreshToken);

  //     res.cookie('accessToken', newAccessToken, {
  //       httpOnly: true,
  //       secure: true,
  //       sameSite: 'strict',
  //     });

  //     res.cookie('refreshToken', newRefreshToken, {
  //       httpOnly: true,
  //       secure: true,
  //       sameSite: 'strict',
  //     });

  //     res.status(200).json({ error: false, message: 'Tokens updated successfully' });
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).json({ error: true, message: (error as Error).message });
  //   }
  // }

  static async logout(req: Request, res: Response) {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      res.status(400).json({ error: true, message: 'No token provided' });
    }

    try {
      const message = await AuthService.logout(refreshToken);

      res.clearCookie('accessToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });

      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });

      res.status(200).json({ error: false, message });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: true, message: (error as Error).message });
    }
  }
}

export default AuthController;
