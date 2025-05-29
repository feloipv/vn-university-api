import { TrainingFieldModel } from '@/models/trainingField';
import { UniversityModel } from '@/models/university';
import { universitySchema } from '@/schemas/university';
import { CustomError } from '@/utils/errorUtils';
import { validateData } from '@/utils/ValidateUtils';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

const updateUniversity = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const data = validateData(universitySchema.partial(), req.body);

    const university = await UniversityModel.findById(id).session(session);
    if (!university) throw new CustomError('University not found', 404);

    // Nếu có cập nhật trainingFields

    if (data.trainingFields && data.trainingFields.length > 0) {
      const newTrainingFieldIds =
        data.trainingFields?.map((tf) => tf.trainingFieldId) || [];

      // 1. Xoá ID trường đại học khỏi tất cả trainingField cũ
      const oldTrainingFieldIds =
        university.trainingFields?.map((tf) => tf.trainingFieldId.toString()) ||
        [];

      const added = newTrainingFieldIds.filter(
        (id) => !oldTrainingFieldIds.includes(id)
      );
      const removed = oldTrainingFieldIds.filter(
        (id) => !newTrainingFieldIds.includes(id)
      );

      if (removed.length > 0) {
        await TrainingFieldModel.updateMany(
          { _id: { $in: removed } },
          { $pull: { universityIds: university._id } },
          { session }
        );
      }

      // 2. Thêm ID trường đại học vào các trainingField mới
      if (added.length > 0) {
        await TrainingFieldModel.updateMany(
          { _id: { $in: added } },
          { $addToSet: { universityIds: university._id } },
          { session }
        );
      }
    }

    const updatedUniversity = await UniversityModel.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        session,
      }
    );

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: 'University updated successfully',
      data: updatedUniversity,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export default updateUniversity;
