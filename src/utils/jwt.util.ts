import jwt from 'jsonwebtoken';

export const generateAccessToken = (userId: string) => {
  const accessSecret = process.env.ACCESS_TOKEN_SECRET;

  if (!accessSecret)
    throw new Error('ACCESS_TOKEN_SECRET is not defined in .env');

  return jwt.sign({ userId }, accessSecret, {
    expiresIn: '15m',
  });
};

export const generateRefreshToken = (userId: string) => {
  const refreshSecret = process.env.REFRESH_TOKEN_SECRET;

  if (!refreshSecret)
    throw new Error('REFRESH_TOKEN_SECRET is not defined in .env');

  return jwt.sign({ userId }, refreshSecret, {
    expiresIn: '5d',
  });
};

export const verifyAccessToken = (token: string): { userId: string } => {
  const accessSecret = process.env.ACCESS_TOKEN_SECRET;

  if (!accessSecret)
    throw new Error('ACCESS_TOKEN_SECRET is not defined in .env');

  return jwt.verify(token, accessSecret) as { userId: string };
};

export const verifyRefreshToken = (token: string): { userId: string } => {
  const refreshSecret = process.env.REFRESH_TOKEN_SECRET;

  if (!refreshSecret)
    throw new Error('REFRESH_TOKEN_SECRET is not defined in .env');

  return jwt.verify(token, refreshSecret) as { userId: string };
};
