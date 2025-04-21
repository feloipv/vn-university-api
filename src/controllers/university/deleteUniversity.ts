import { CategoryModel } from '@/models/category';
import { UniversityModel } from '@/models/university';
import { CustomError } from '@/utils/errorUtils';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

const deleteUniversity = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    const university = await UniversityModel.findById(id).session(session);
    if (!university) throw new CustomError('University not found', 404);

    await Promise.all([
      UniversityModel.findByIdAndDelete(id, { session }),
      CategoryModel.updateMany(
        { universityIds: id },
        { $pull: { universityIds: id } },
        { session }
      ),
    ]);

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: 'University deleted successfully',
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export default deleteUniversity;
