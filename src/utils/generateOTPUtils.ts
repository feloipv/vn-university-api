import User from '@/models/user';
import { CustomError } from './errorUtils';

export const generateOTP = async (): Promise<{
  otp: string;
  otpExpiresAt: Date;
}> => {
  let otp: string;
  let otpExpiresAt: Date;
  let isDuplicate = true;
  let attempts = 0;
  const maxAttempts = 5;

  do {
    otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const existingUser = await User.findOne({ otp });

    if (!existingUser) {
      isDuplicate = false;
    } else {
      attempts++;
    }

    if (attempts >= maxAttempts) {
      throw new CustomError(
        'Failed to generate OTP, please try again later',
        500
      );
    }
  } while (isDuplicate);

  return { otp, otpExpiresAt };
};
