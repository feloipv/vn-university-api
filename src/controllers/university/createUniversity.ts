import { CategoryModel } from '@/models/category';
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

    if (data.categoryIds && data.categoryIds.length > 0) {
      const existingCategories = await CategoryModel.find({
        _id: { $in: data.categoryIds },
      }).session(session);

      const existingIds = existingCategories.map((c) => c._id.toString());

      const invalidIds = data.categoryIds.filter(
        (id) => !existingIds.includes(id)
      );

      if (invalidIds.length > 0) {
        throw new CustomError(
          'Some category IDs do not exist',
          400,
          invalidIds
        );
      }
    }

    const newUniversity = await UniversityModel.create([{ ...data }], {
      session,
    });

    await CategoryModel.updateMany(
      { _id: { $in: data.categoryIds } },
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
