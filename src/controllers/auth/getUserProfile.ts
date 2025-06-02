import { AuthenticatedRequest } from '@/interfaces/auth';
import { UserModel } from '@/models/user';
import { CustomError } from '@/utils/errorUtils';
import { NextFunction, Request, Response } from 'express';

const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as unknown as AuthenticatedRequest).user?._id as string;

    const user = await UserModel.findById(userId)
      .populate('favoriteUniversityIds', 'name code logo city')
      .select('userName email avatar favoriteUniversityIds')
      .lean();

    if (!user) {
      throw new CustomError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Get user profile successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export default getUserProfile;
