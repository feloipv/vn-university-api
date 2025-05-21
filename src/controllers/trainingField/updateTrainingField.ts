import { TrainingFieldModel } from '@/models/trainingField';
import { UniversityModel } from '@/models/university';
import { MajorModel } from '@/models/major';
import { trainingFieldSchema } from '@/schemas/trainingField';
import { CustomError } from '@/utils/errorUtils';
import { validateData } from '@/utils/ValidateUtils';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

const updateTrainingField = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    const data = validateData(trainingFieldSchema.partial(), req.body);

    const trainingField =
      await TrainingFieldModel.findById(id).session(session);
    if (!trainingField) throw new CustomError('TrainingField not found', 404);

    // So sánh universityIds
    const oldUniversityIds =
      trainingField.universityIds?.map((id) => String(id)) || [];
    const newUniversityIds = data.universityIds || [];

    const universityAdded = newUniversityIds.filter(
      (id) => !oldUniversityIds.includes(id)
    );
    const universityRemoved = oldUniversityIds.filter(
      (id) => !newUniversityIds.includes(id)
    );

    // So sánh majorIds
    const oldMajorIds = trainingField.majorIds?.map((id) => String(id)) || [];
    const newMajorIds = data.majorIds || [];

    const majorAdded = newMajorIds.filter((id) => !oldMajorIds.includes(id));
    const majorRemoved = oldMajorIds.filter((id) => !newMajorIds.includes(id));

    // Cập nhật TrainingField
    const updated = await TrainingFieldModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
      session,
    });

    // Cập nhật UniversityModel
    if (universityAdded.length > 0) {
      await UniversityModel.updateMany(
        { _id: { $in: universityAdded } },
        { $addToSet: { trainingFieldIds: id } },
        { session }
      );
    }
    if (universityRemoved.length > 0) {
      await UniversityModel.updateMany(
        { _id: { $in: universityRemoved } },
        { $pull: { trainingFieldIds: id } },
        { session }
      );
    }

    // Cập nhật MajorModel
    if (majorAdded.length > 0) {
      await MajorModel.updateMany(
        { _id: { $in: majorAdded } },
        { $addToSet: { trainingFieldIds: id } },
        { session }
      );
    }
    if (majorRemoved.length > 0) {
      await MajorModel.updateMany(
        { _id: { $in: majorRemoved } },
        { $pull: { trainingFieldIds: id } },
        { session }
      );

      await UniversityModel.updateMany(
        { 'trainingFields.trainingFieldId': id },
        {
          $pull: {
            'trainingFields.$[].majors': {
              majorId: { $in: majorRemoved },
            },
          },
        },
        { session }
      );
    }

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: 'TrainingField updated successfully',
      data: updated,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export default updateTrainingField;
