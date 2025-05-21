import { MajorModel } from '@/models/major';
import { TrainingFieldModel } from '@/models/trainingField';
import { UniversityModel } from '@/models/university';
import { universitySchema } from '@/schemas/university';
import { CustomError } from '@/utils/errorUtils';
import { validateData } from '@/utils/ValidateUtils';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

const createUniversity = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const data = validateData(universitySchema, req.body);

    const existing = await UniversityModel.findOne({ name: data.name }).session(
      session
    );
    if (existing) throw new CustomError('University already exists', 400);

    let trainingFieldIds: string[] = [];

    if (data.trainingFields && data.trainingFields.length > 0) {
      const tfIdSet = new Set();
      for (const tf of data.trainingFields) {
        if (tfIdSet.has(tf.trainingFieldId)) {
          throw new CustomError('Duplicate trainingFieldId detected', 400, [
            tf.trainingFieldId,
          ]);
        }
        tfIdSet.add(tf.trainingFieldId);

        const majorIdSet = new Set();
        for (const major of tf.majors || []) {
          if (majorIdSet.has(major.majorId)) {
            throw new CustomError('Duplicate majorId in a trainingField', 400, [
              major.majorId,
            ]);
          }
          majorIdSet.add(major.majorId);
        }
      }

      trainingFieldIds = data.trainingFields.map(
        (field) => field.trainingFieldId
      );

      // 1. Check training field IDs
      const existingTrainingFields = await TrainingFieldModel.find({
        _id: { $in: trainingFieldIds },
      }).session(session);

      const existingTFIds = existingTrainingFields.map((tf) =>
        tf._id.toString()
      );
      const invalidTFIds = trainingFieldIds.filter(
        (id) => !existingTFIds.includes(id)
      );

      if (invalidTFIds.length > 0) {
        throw new CustomError(
          'Some training field IDs do not exist',
          400,
          invalidTFIds
        );
      }

      // 2. Check major IDs
      const allMajorIds = data.trainingFields.flatMap(
        (field) => field.majors?.map((m) => m.majorId) || []
      );

      if (allMajorIds.length > 0) {
        const existingMajors = await MajorModel.find({
          _id: { $in: allMajorIds },
        }).session(session);

        const existingMajorIds = existingMajors.map((m) => m._id.toString());
        const invalidMajorIds = allMajorIds.filter(
          (id) => !existingMajorIds.includes(id)
        );

        if (invalidMajorIds.length > 0) {
          throw new CustomError(
            'Some major IDs do not exist',
            400,
            invalidMajorIds
          );
        }
      }
    }

    const newUniversity = await UniversityModel.create([data], {
      session,
    });

    await TrainingFieldModel.updateMany(
      { _id: { $in: trainingFieldIds } },
      { $addToSet: { universityIds: newUniversity[0]._id } },
      { session }
    );

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: 'University created successfully',
      data: newUniversity[0],
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export default createUniversity;
