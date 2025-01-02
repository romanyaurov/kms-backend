import { Request, Response, NextFunction } from 'express';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from '../utils/jwt.util';
import { TokenExpiredError } from 'jsonwebtoken';
import TokenModel from '../models/token.model';

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { accessToken, refreshToken } = req.cookies;

  if (!accessToken) {
    res.status(401).json({ error: true, message: 'Unauthorized' });
    return;
  }

  try {
    const payload = verifyAccessToken(accessToken);
    req.user = payload.userId;
    next();
    return;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      if (!refreshToken) {
        res
          .status(401)
          .json({
            error: true,
            message: 'Unauthorized: refresh token missing',
          });
        return;
      }

      try {
        const refreshPayload = verifyRefreshToken(refreshToken);
        const tokenEntry = await TokenModel.findOne({ refreshToken });

        if (!tokenEntry) {
          res
            .status(401)
            .json({ error: true, message: 'Invalid refresh token' });
          return;
        }

        const newAccessToken = generateAccessToken(refreshPayload.userId);
        const newRefreshToken = generateRefreshToken(refreshPayload.userId);

        tokenEntry.refreshToken = newRefreshToken;
        await tokenEntry.save();

        res.cookie('accessToken', newAccessToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
        });

        res.cookie('refreshToken', newRefreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
        });

        req.user = refreshPayload.userId;

        next();
        return;
      } catch (refreshError) {
        await TokenModel.deleteOne({ refreshToken });
        res
          .status(401)
          .json({
            error: true,
            message: 'Unauthorized: refresh token expired or invalid',
          });
        return;
      }
    }
    res.status(401).json({ error: true, message: 'Invalid token' });
    return;
  }
};

export default authenticate;
