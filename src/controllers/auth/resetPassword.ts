import { NextFunction, Request, Response } from 'express';
import { IUser } from '@/schemas/auth';
import { UserModel } from '@/models/user';
import bcrypt from 'bcryptjs';
import { validateData } from '@/utils/ValidateUtils';
import { resetPasswordSchema } from '@/schemas/auth';
import { AuthenticatedRequest } from '@/interfaces/auth';

const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = (req as unknown as AuthenticatedRequest).user as IUser;

    const { password } = validateData(resetPasswordSchema, req.body);
    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.findOneAndUpdate(
      { email },
      { password: hashedPassword, otp: null, otpExpiresAt: null }
    );

    res.status(200).json({ message: 'Password was reset successfully' });
  } catch (error) {
    next(error);
  }
};

export default resetPassword;
