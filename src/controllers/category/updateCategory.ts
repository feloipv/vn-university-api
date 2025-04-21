import { CategoryModel } from '@/models/category';
import { categorySchema } from '@/schemas/category';
import { CustomError } from '@/utils/errorUtils';
import { validateData } from '@/utils/ValidateUtils';
import { NextFunction, Request, Response } from 'express';

const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const data = validateData(categorySchema, req.body);

    const category = await CategoryModel.findById(id);
    if (!category) throw new CustomError('Category not found', 404);

    const updated = await CategoryModel.findByIdAndUpdate(id, data, {
      new: true,
    });

    res.status(200).json({
      message: 'Category updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export default updateCategory;
