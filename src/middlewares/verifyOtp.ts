import User from '@/models/user';
import { verifyOtpSchema } from '@/schemas/auth';
import { CustomError } from '@/utils/errorUtils';
import { validateData } from '@/utils/ValidateUtils';
import { NextFunction, Request, Response } from 'express';

const verifyOtp = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const { email, otp } = validateData(verifyOtpSchema, req.body);

    const user = await User.findOne({ email });
    if (!user) throw new CustomError('Incorrect email', 401);

    if (!otp || user.otp !== otp) {
      throw new CustomError('Invalid OTP', 400);
    }

    if (
      !user.otpExpiresAt ||
      new Date(user.otpExpiresAt).getTime() < Date.now()
    ) {
      throw new CustomError('expired OTP', 400);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default verifyOtp;
