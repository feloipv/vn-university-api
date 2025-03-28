import sendEmail from '@/config/mailer';
import User from '@/models/user';
import { resendOtpSchema, validateData } from '@/schemas/auth';
import { CustomError } from '@/utils/errorUtils';
import { generateOTP } from '@/utils/generateOTP';
import { NextFunction, Request, Response } from 'express';

const resendOTP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = validateData(resendOtpSchema, req.body);

    const user = await User.findOne({ email, isActivate: false });

    if (!user) {
      throw new CustomError('User not found or already activated.', 400);
    }

    const now = Date.now();
    if (
      user.otp &&
      user.otpExpiresAt &&
      now - user.otpExpiresAt.getTime() < 60 * 1000
    ) {
      throw new CustomError('Please wait before requesting a new OTP.', 429);
    }

    const { otp, otpExpiresAt } = await generateOTP();

    await User.findOneAndUpdate(
      { email, isActivate: false },
      { otp, otpExpiresAt },
      { new: true }
    );

    await sendEmail(email, otp);

    res.status(200).json({ message: 'OTP resent successfully.' });
  } catch (error) {
    next(error);
  }
};

export default resendOTP;
