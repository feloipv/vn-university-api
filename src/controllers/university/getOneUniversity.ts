import { UniversityModel } from '@/models/university';
import { CustomError } from '@/utils/errorUtils';
import { NextFunction, Request, Response } from 'express';

const getUniversityById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const university = await UniversityModel.findById(id)
      .populate('trainingFields.trainingFieldId', '-majorIds -universityIds')
      .populate('trainingFields.majors.majorId', '-trainingFieldId')
      .lean();

    if (!university) throw new CustomError('University not found', 404);

    res.status(200).json({
      success: true,
      message: 'Get university successfully',
      data: university,
    });
  } catch (error) {
    next(error);
  }
};

export default getUniversityById;
