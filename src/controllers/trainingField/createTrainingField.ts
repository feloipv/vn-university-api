import { MajorModel } from '@/models/major';
import { TrainingFieldModel } from '@/models/trainingField';
import { trainingFieldSchema } from '@/schemas/trainingField';
import { CustomError } from '@/utils/errorUtils';
import { validateData } from '@/utils/ValidateUtils';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

const createTrainingField = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const data = validateData(trainingFieldSchema, req.body);

    const existing = await TrainingFieldModel.findOne({
      name: data.name,
    }).session(session);
    if (existing) throw new CustomError('Training field already exists', 400);

    const createdField = await TrainingFieldModel.create([data], { session });

    if (data.majorIds && data.majorIds.length > 0) {
      await MajorModel.updateMany(
        { _id: { $in: data.majorIds } },
        { $addToSet: { trainingFieldIds: createdField[0]._id } },
        { session }
      );
    }

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: 'Training field created successfully',
      data: createdField[0],
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export default createTrainingField;
