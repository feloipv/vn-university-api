import { MajorModel } from '@/models/major';
import { TrainingFieldModel } from '@/models/trainingField';
import { UniversityModel } from '@/models/university';
import { majorSchema } from '@/schemas/major';
import { CustomError } from '@/utils/errorUtils';
import { validateData } from '@/utils/ValidateUtils';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

const updateMajor = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    const data = validateData(majorSchema.partial(), req.body);

    const major = await MajorModel.findById(id).session(session);
    if (!major) throw new CustomError('Major not found', 404);

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

    const oldTrainingFieldIds =
      major.trainingFieldIds?.map((id) => String(id)) || [];
    const newTrainingFieldIds = data.trainingFieldIds || [];

    const added = newTrainingFieldIds.filter(
      (id) => !oldTrainingFieldIds.includes(id)
    );
    const removed = oldTrainingFieldIds.filter(
      (id) => !newTrainingFieldIds.includes(id)
    );

    const updated = await MajorModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
      session,
    });

    if (added.length > 0) {
      await TrainingFieldModel.updateMany(
        { _id: { $in: added } },
        { $addToSet: { majorIds: id } },
        { session }
      );
    }

    if (removed.length > 0) {
      await TrainingFieldModel.updateMany(
        { _id: { $in: removed } },
        { $pull: { majorIds: id } },
        { session }
      );

      await UniversityModel.updateMany(
        { 'trainingFields.trainingFieldId': { $in: removed } },
        {
          $pull: {
            'trainingFields.$[].majors': { majorId: id },
          },
        },
        { session }
      );
    }

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: 'Major updated successfully',
      data: updated,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export default updateMajor;
