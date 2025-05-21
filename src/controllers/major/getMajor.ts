import { MajorModel } from '@/models/major';
import { TrainingFieldModel } from '@/models/trainingField';
import { Request, Response, NextFunction } from 'express';

const getMajor = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    const query: Record<string, any> = {};
    query.name = new RegExp(search as string, 'i');

    const {
      docs: Majors,
      totalDocs,
      totalPages,
    } = await MajorModel.paginate(query, {
      page: Number(page),
      limit: Number(limit),
    });

    res.status(200).json({
      success: true,
      message: 'Get Majors successfully',
      data: Majors,
      pagination: {
        total: totalDocs,
        totalPages,
        page: Number(page),
        limit: Number(limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

export default getMajor;
