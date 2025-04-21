import { CategoryModel } from '@/models/category';
import { UniversityModel } from '@/models/university';
import { IuniversitySchema } from '@/schemas/university';
import { CustomError } from '@/utils/errorUtils';
import { Request, Response, NextFunction } from 'express';

const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const category = await CategoryModel.findById(id);
    if (!category) {
      throw new CustomError('Workspace not found', 404);
    }

    await CategoryModel.findByIdAndDelete(id);

    await UniversityModel.updateMany<IuniversitySchema>(
      { categoryIds: id },
      { $pull: { categoryIds: id } }
    );

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export default deleteCategory;
