import sendEmail from '@/config/mailer';
import { UserModel } from '@/models/user';
import { IUser, sendOtpSchema } from '@/schemas/auth';
import { CustomError } from '@/utils/errorUtils';
import { generateOTP } from '@/utils/generateOTPUtils';
import { validateData } from '@/utils/ValidateUtils';
import { NextFunction, Request, Response } from 'express';

const sendOTP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = validateData(sendOtpSchema, req.body);

    const user = await UserModel.findOne<IUser & { updatedAt: Date }>({
      email,
    });

    if (!user) {
      throw new CustomError('Incorrect email.', 400);
    }

    const now = Date.now();
    if (
      user.otp &&
      user.otpExpiresAt &&
      now - user.updatedAt.getTime() < 30 * 1000
    ) {
      const remainingSeconds = Math.ceil(
        (30 * 1000 - (now - user.updatedAt.getTime())) / 1000
      );
      throw new CustomError(
        `Please wait ${remainingSeconds}s before requesting a new OTP.`,
        429
      );
    }

    const { otp, otpExpiresAt } = await generateOTP();

    await UserModel.findOneAndUpdate(
      { email },
      { otp, otpExpiresAt },
      { new: true }
    );

    await sendEmail(email, otp);

    res.status(200).json({ message: 'OTP sent successfully.' });
  } catch (error) {
    next(error);
  }
};

export default sendOTP;
