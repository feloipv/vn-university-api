import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '@/models/user';
import { CustomError } from '@/utils/errorUtils';
import { generateTokens } from '@/utils/generateTokensUtils';

const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    throw new CustomError('Refresh token not provided', 401);
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as { userId: string };

    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new CustomError('User not found', 404);
    }

    if (!user.isActivate) {
      throw new CustomError('Account not activated', 403);
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      String(user._id)
    );

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'none',
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'none',
    });

    res.status(200).json({
      status: 200,
      message: 'Token refreshed successfully',
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return next(new CustomError('Invalid Token', 400));
    }

    if (error instanceof Error && error.name === 'TokenExpiredError') {
      next(new CustomError('Token has expired', 400));
    }
    next(error);
  }
};

export default refreshToken;
