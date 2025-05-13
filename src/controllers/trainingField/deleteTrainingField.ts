import { TrainingFieldModel } from '@/models/trainingField';
import { UniversityModel } from '@/models/university';
import { Iuniversity } from '@/schemas/university';
import { CustomError } from '@/utils/errorUtils';
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

const deleteTrainingField = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    const trainingField =
      await TrainingFieldModel.findById(id).session(session);
    if (!trainingField) {
      throw new CustomError('Training Field not found', 404);
    }

    await TrainingFieldModel.findByIdAndDelete(id, { session });

    await UniversityModel.updateMany<Iuniversity>(
      { trainingFieldIds: id },
      { $pull: { trainingFieldIds: id } },
      { session }
    );

    await session.commitTransaction();
    res.status(200).json({
      success: true,
      message: 'Training field deleted successfully',
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export default deleteTrainingField;
