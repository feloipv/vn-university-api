import { MajorModel } from '@/models/major';
import { TrainingFieldModel } from '@/models/trainingField';
import { UniversityModel } from '@/models/university';
import { CustomError } from '@/utils/errorUtils';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

const deleteMajor = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    const major = await MajorModel.findById(id).session(session);
    if (!major) throw new CustomError('Major not found', 404);

    if (major.trainingFieldIds && major.trainingFieldIds.length > 0) {
      await TrainingFieldModel.updateMany(
        { _id: { $in: major.trainingFieldIds } },
        { $pull: { majorIds: id } },
        { session }
      );
    }

    await UniversityModel.updateMany(
      { 'trainingFields.majors.majorId': id },
      {
        $pull: {
          'trainingFields.$[].majors': { majorId: id },
        },
      },
      { session }
    );

    // Xóa major
    await MajorModel.findByIdAndDelete(id, { session });

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: 'Major deleted successfully',
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export default deleteMajor;
