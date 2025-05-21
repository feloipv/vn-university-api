import { NextFunction, Request, RequestHandler, Response } from 'express';
import { UserModel } from '@/models/user';
import { generateTokens } from '@/utils/generateTokensUtils';
import { IUser } from '@/schemas/auth';
import { AuthenticatedRequest } from '@/interfaces/auth';

const activateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = (req as unknown as AuthenticatedRequest).user as IUser;
    const newUser = await UserModel.findOneAndUpdate(
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

    res.status(200).json({ message: 'Activated successfully' });
  } catch (error) {
    next(error);
  }
};

export default activateUser;
