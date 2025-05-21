import { AuthenticatedRequest } from '@/interfaces/auth';
import { UserModel } from '@/models/user';
import { CustomError } from '@/utils/errorUtils';
import { Response, NextFunction, Request } from 'express';
import jwt from 'jsonwebtoken';

const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies?.accessToken;
    if (!accessToken) {
      throw new CustomError('You must log in to perform this action.', 401);
    }

    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as {
      userId: string;
    };

    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      throw new CustomError('User does not exist', 404);
    }

    if (!user.isActivate) {
      throw new CustomError('Account not activated', 403);
    }

    (req as unknown as AuthenticatedRequest).user = user;
    next();
  } catch (error) {
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return next(new CustomError('Invalid Token', 401));
    }

    if (error instanceof Error && error.name === 'TokenExpiredError') {
      return next(new CustomError('Token has expired', 401));
    }

    next(error);
  }
};

export default authenticate;
