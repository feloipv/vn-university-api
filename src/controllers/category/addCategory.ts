// src/controllers/category.controller.ts
import { CategoryModel } from '@/models/category';
import { categorySchema } from '@/schemas/category';
import { CustomError } from '@/utils/errorUtils';
import { validateData } from '@/utils/ValidateUtils';
import { NextFunction, Request, Response } from 'express';

const addCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = validateData(categorySchema, req.body);

    const existing = await CategoryModel.findOne({ name: data.name });
    if (existing) throw new CustomError('Category already exists', 400);

    const newCategory = await CategoryModel.create(data);

    res.status(201).json({
      success: true,
      message: 'Create category successfully',
      data: newCategory,
    });
  } catch (error) {
    next(error);
  }
};

export default addCategory;
