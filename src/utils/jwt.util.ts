import jwt from 'jsonwebtoken';

const accessSecret = process.env.ACCESS_TOKEN_SECRET!;
const refreshSecret = process.env.REFRESH_TOKEN_SECRET!;

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, accessSecret, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
  });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, refreshSecret, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
  });
};

export const verifyAccessToken = (token: string): { userId: string } => {
  return jwt.verify(token, accessSecret) as { userId: string };
};

export const verifyRefreshToken = (token: string): { userId: string } => {
  return jwt.verify(token, refreshSecret) as { userId: string };
};
