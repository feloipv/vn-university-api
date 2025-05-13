import { TrainingFieldModel } from '@/models/trainingField';
import { createTrainingFieldschema } from '@/schemas/trainingField';
import { CustomError } from '@/utils/errorUtils';
import { validateData } from '@/utils/ValidateUtils';
import { NextFunction, Request, Response } from 'express';

const createTrainingField = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = validateData(createTrainingFieldschema, req.body);

    const existing = await TrainingFieldModel.findOne({ name: data.name });
    if (existing) throw new CustomError('Training field already exists', 400);

    const newTrainingField = await TrainingFieldModel.create(data);

    res.status(201).json({
      success: true,
      message: 'Training field created successfully',
      data: newTrainingField,
    });
  } catch (error) {
    next(error);
  }
};

export default createTrainingField;
