import { MajorModel } from '@/models/major';
import { TrainingFieldModel } from '@/models/trainingField';
import { majorSchema } from '@/schemas/major';
import { CustomError } from '@/utils/errorUtils';
import { validateData } from '@/utils/ValidateUtils';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

const createMajor = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const data = validateData(majorSchema, req.body);

    const existing = await MajorModel.findOne({ name: data.name })
      .session(session)
      .lean();
    if (existing) throw new CustomError('Major already exists', 400);

    if (data.trainingFieldIds && data.trainingFieldIds.length > 0) {
      // 1. Check training field IDs
      const existingTrainingFields = await TrainingFieldModel.find({
        _id: { $in: data.trainingFieldIds },
      }).session(session);

      const existingTFIds = existingTrainingFields.map((tf) =>
        tf._id.toString()
      );
      const invalidTFIds = data.trainingFieldIds.filter(
        (id) => !existingTFIds.includes(id)
      );

      if (invalidTFIds.length > 0) {
        throw new CustomError(
          'Some training field IDs do not exist',
          400,
          invalidTFIds
        );
      }
    }

    const createdMajor = await MajorModel.create([data], { session });

    await TrainingFieldModel.updateMany(
      { _id: { $in: data.trainingFieldIds } },
      { $addToSet: { majorIds: createdMajor[0]._id } },
      { session }
    );

    await session.commitTransaction();
    res.status(201).json({
      success: true,
      message: 'Major created successfully',
      data: createdMajor[0],
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export default createMajor;
