import { NextFunction, Request, Response } from 'express';
import User from '@/models/user';
import { signinSchema } from '@/schemas/auth';
import { CustomError } from '@/utils/errorUtils';
import { validateData } from '@/utils/ValidateUtils';
import bcrypt from 'bcryptjs';
import { generateTokens } from '@/utils/generateTokensUtils';

const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = validateData(signinSchema, req.body);

    const user = await User.findOne({ email });
    if (!user) throw new CustomError('Incorrect email or password', 401);

    if (!user.isActivate) throw new CustomError('Account not activated.', 403);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new CustomError('Incorrect email or password', 401);

    const { accessToken, refreshToken } = generateTokens(String(user?._id));
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'none',
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'none',
    });

    res.status(200).json({ message: 'Signin successfully' });
  } catch (error) {
    next(error);
  }
};
export default signin;
