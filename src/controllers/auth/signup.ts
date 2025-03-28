import { signupSchema, validateData } from '@/schemas/auth';
import { CustomError } from '@/utils/errorUtils';
import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { generateTokens } from '@/utils/generateTokens';
import { IUser } from '@/interfaces/auth';
import { generateOTP } from '@/utils/generateOTP';
import sendEmail from '@/config/mailer';
import User from '@/models/user';

const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userName, email, password } = validateData(signupSchema, req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new CustomError('Email is already in use', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const { otp, otpExpiresAt } = await generateOTP();

    await User.create({
      userName,
      email,
      password: hashedPassword,
      otp,
      otpExpiresAt,
    });

    await sendEmail(email, otp);

    res.status(200).json({
      message: 'Please check your email to activate your account',
    });
  } catch (error) {
    next(error);
  }
};

export default signup;
