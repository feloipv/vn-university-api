import { TrainingFieldModel } from '@/models/trainingField';
import { trainingFieldSchema } from '@/schemas/trainingField';
import { CustomError } from '@/utils/errorUtils';
import { validateData } from '@/utils/ValidateUtils';
import { NextFunction, Request, Response } from 'express';

const updateTrainingField = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const data = validateData(trainingFieldSchema, req.body);

    const trainingField = await TrainingFieldModel.findById(id);
    if (!trainingField) throw new CustomError('TrainingField not found', 404);

    const updated = await TrainingFieldModel.findByIdAndUpdate(id, data, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: 'TrainingField updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export default updateTrainingField;
