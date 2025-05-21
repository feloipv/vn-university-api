import { MajorModel } from '@/models/major';
import { CustomError } from '@/utils/errorUtils';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

const getMajorById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError(`Invalid ID: ${id}`, 400);
    }

    const major = await MajorModel.findById(id)
      .populate({
        path: 'trainingFieldIds',
        select: '-universityIds -majorIds',
        populate: {
          path: 'universityIds',
          select: '-trainingFields',
        },
      })
      .lean();

    if (!major) {
      throw new CustomError('Major not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Get Major successfully',
      data: major,
    });
  } catch (error) {
    next(error);
  }
};

export default getMajorById;
