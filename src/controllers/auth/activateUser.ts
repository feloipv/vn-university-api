import { NextFunction, Request, Response } from 'express';
import User from '@/models/user';
import { activateUserSchema } from '@/schemas/auth';
import { CustomError } from '@/utils/errorUtils';
import { generateTokens } from '@/utils/generateTokensUtils';
import { validateData } from '@/utils/ValidateUtils';

const activateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp } = validateData(activateUserSchema, req.body);

    const user = await User.findOne({ email });
    if (!user) {
      throw new CustomError('User not found', 404);
    }

    if (user.isActivate) {
      throw new CustomError('User already activated', 400);
    }

    if (
      user.otp !== otp ||
      !user.otpExpiresAt ||
      user.otpExpiresAt < new Date()
    ) {
      throw new CustomError('Invalid or expired OTP', 400);
    }

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
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'none',
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'none',
    });

    res.status(200).json({ message: 'User activated successfully' });
  } catch (error) {
    next(error);
  }
};

export default activateUser;
