import { cateCtrl } from '@/controllers/trainingField';
import authenticate from '@/middlewares/authenticate';
import express from 'express';

const trainingFieldRouter = express.Router();

trainingFieldRouter.get(
  '/training_fields',
  authenticate,
  cateCtrl.getTrainingField
);
trainingFieldRouter.get(
  '/training_field/:id',
  authenticate,
  cateCtrl.getTrainingFieldById
);
trainingFieldRouter.post(
  '/training_field',
  authenticate,
  cateCtrl.createTrainingField
);
trainingFieldRouter.patch(
  '/training_field/:id',
  authenticate,
  cateCtrl.updateTrainingField
);
trainingFieldRouter.delete(
  '/training_field/:id',
  authenticate,
  cateCtrl.deleteTrainingField
);

export default trainingFieldRouter;
