import { NextFunction, Request, Response } from 'express';

const signout = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'none',
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'none',
    });

    res.status(200).json({
      status: 200,
      message: 'Signout successful',
    });
  } catch (error) {
    next(error);
  }
};

export default signout;
