import { CategoryModel } from '@/models/category';
import { ICategory } from '@/schemas/category';
import { CustomError } from '@/utils/errorUtils';
import { NextFunction, Request, Response } from 'express';

export const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const category =
      await CategoryModel.findById(id).populate<ICategory>('universityIds');
    if (!category) throw new CustomError('Category not found', 404);

    return res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};
