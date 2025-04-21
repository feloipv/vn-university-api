import { CategoryModel } from '@/models/category';
import { Request, Response, NextFunction } from 'express';

const getCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const { docs: categories } = await CategoryModel.paginate(
      {},
      { page: Number(page), limit: Number(limit) }
    );

    res.status(200).json({
      success: true,
      message: 'Get categories successfully',
      data: categories,
    });
  } catch (err) {
    next(err);
  }
};

export default getCategory;
