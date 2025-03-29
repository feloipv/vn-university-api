import { NextFunction, Request, Response } from 'express';
import { IUser } from '@/interfaces/auth';
import User from '@/models/user';
import bcrypt from 'bcryptjs';
import { validateData } from '@/utils/ValidateUtils';
import { resetPasswordSchema } from '@/schemas/auth';

const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.user as IUser;

    const { password } = validateData(resetPasswordSchema, req.body);
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findOneAndUpdate(
      { email },
      { password: hashedPassword, otp: null, otpExpiresAt: null }
    );

    res.status(200).json({ message: 'Password was reset successfully' });
  } catch (error) {
    next(error);
  }
};

export default resetPassword;
