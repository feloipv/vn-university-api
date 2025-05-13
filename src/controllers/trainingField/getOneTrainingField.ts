import { TrainingFieldModel } from '@/models/trainingField';
import { ITrainingField } from '@/schemas/trainingField';
import { CustomError } from '@/utils/errorUtils';
import { NextFunction, Request, Response } from 'express';

const getTrainingFieldById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const trainingField =
      await TrainingFieldModel.findById(id).populate<ITrainingField>(
        'universityIds'
      );
    if (!trainingField) throw new CustomError('Training field not found', 404);

    res.status(200).json({
      success: true,
      message: 'Get training fields successfully',
      data: trainingField,
    });
  } catch (error) {
    next(error);
  }
};

export default getTrainingFieldById;
