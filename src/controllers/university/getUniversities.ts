import { UniversityModel } from '@/models/university';
import { Request, Response, NextFunction } from 'express';

const getUniversities = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    const searchRegex = new RegExp(search as string, 'i');
    const query = search ? { name: searchRegex } : {};

    const {
      docs: universities,
      totalDocs,
      totalPages,
    } = await UniversityModel.paginate(query, {
      page: Number(page),
      limit: Number(limit),
    });

    res.status(200).json({
      success: true,
      message: 'Get university successfully',
      data: universities,
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

export default getUniversities;
