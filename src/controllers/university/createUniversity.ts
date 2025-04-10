import { CategoryModel } from '@/models/category';
import { UniversityModel } from '@/models/university';
import { universitySchema } from '@/schemas/university';
import { CustomError } from '@/utils/errorUtils';
import { validateData } from '@/utils/ValidateUtils';
import { NextFunction, Request, Response } from 'express';

const createUniversity = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = validateData(universitySchema, req.body);

    const existing = await UniversityModel.findOne({ name: data.name });
    if (existing) throw new CustomError('University already exists', 400);

    if (data.categoryIds && data.categoryIds.length > 0) {
      const existingCategories = await CategoryModel.find({
        _id: { $in: data.categoryIds },
      });

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

    const newUniversity = await UniversityModel.create(data);

    await CategoryModel.updateMany(
      { _id: { $in: data.categoryIds } },
      { $addToSet: { universityIds: newUniversity._id } }
    );

    res.status(201).json({
      success: true,
      message: 'University created successfully',
      data: newUniversity,
    });
  } catch (error) {
    next(error);
  }
};

export default createUniversity;
