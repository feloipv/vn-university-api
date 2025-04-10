import { CategoryModel } from '@/models/category';
import { UniversityModel } from '@/models/university';
import { universitySchema } from '@/schemas/university';
import { CustomError } from '@/utils/errorUtils';
import { validateData } from '@/utils/ValidateUtils';
import { NextFunction, Request, Response } from 'express';

const updateUniversity = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const data = validateData(universitySchema.partial(), req.body);

    const university = await UniversityModel.findById(id);
    if (!university) {
      throw new CustomError('University not found', 404);
    }

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

      const oldCategoryIds = university.categoryIds?.map((id) => id.toString());
      const toRemove = oldCategoryIds?.filter(
        (id) => !data.categoryIds?.includes(id)
      );
      const toAdd = data.categoryIds?.filter(
        (id) => !oldCategoryIds?.includes(id)
      );

      if (toRemove && toRemove.length > 0) {
        await CategoryModel.updateMany(
          { _id: { $in: toRemove } },
          { $pull: { universityIds: university._id } }
        );
      }

      if (toAdd.length > 0) {
        await CategoryModel.updateMany(
          { _id: { $in: toAdd } },
          { $addToSet: { universityIds: university._id } }
        );
      }
    }

    const updatedUniversity = await UniversityModel.findByIdAndUpdate(
      id,
      data,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'University updated successfully',
      data: updatedUniversity,
    });
  } catch (error) {
    next(error);
  }
};

export default updateUniversity;
