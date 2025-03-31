import { NextFunction, Request, Response } from 'express';
import User from '@/models/user';
import { generateTokens } from '@/utils/generateTokensUtils';
import { IUser } from '@/interfaces/auth';

const activateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.user as IUser;
    const newUser = await User.findOneAndUpdate(
      { email },
      {
        isActivate: true,
        otp: null,
        otpExpiresAt: null,
      },
      { new: true }
    );

    const { accessToken, refreshToken } = generateTokens(String(newUser?._id));
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    res.status(200).json({ message: 'User activated successfully' });
  } catch (error) {
    next(error);
  }
};

export default activateUser;
