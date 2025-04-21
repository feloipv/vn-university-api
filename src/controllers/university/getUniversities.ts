import { UniversityModel } from '@/models/university';
import { Request, Response, NextFunction } from 'express';

const getUniversities = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const { docs: universities } = await UniversityModel.paginate(
      {},
      { page: Number(page), limit: Number(limit) }
    );

    res.status(200).json({
      success: true,
      message: 'Get university successfully',
      data: universities,
    });
  } catch (err) {
    next(err);
  }
};

export default getUniversities;
