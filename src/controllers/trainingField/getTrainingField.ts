import { TrainingFieldModel } from '@/models/trainingField';
import { Request, Response, NextFunction } from 'express';

const getTrainingField = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    const query: Record<string, any> = {};
    query.name = new RegExp(search as string, 'i');

    const {
      docs: trainingFields,
      totalDocs,
      totalPages,
    } = await TrainingFieldModel.paginate(query, {
      page: Number(page),
      limit: Number(limit),
    });

    res.status(200).json({
      success: true,
      message: 'Get training fields successfully',
      data: trainingFields,
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

export default getTrainingField;
