import { tfCtrl } from '@/controllers/trainingField';
import authenticate from '@/middlewares/authenticate';
import express from 'express';

const trainingFieldRouter = express.Router();

trainingFieldRouter.get(
  '/training_fields',
  authenticate,
  tfCtrl.getTrainingField
);
trainingFieldRouter.get(
  '/training_field/:id',
  authenticate,
  tfCtrl.getTrainingFieldById
);
trainingFieldRouter.post(
  '/training_field',
  authenticate,
  tfCtrl.createTrainingField
);
trainingFieldRouter.patch(
  '/training_field/:id',
  authenticate,
  tfCtrl.updateTrainingField
);
trainingFieldRouter.delete(
  '/training_field/:id',
  authenticate,
  tfCtrl.deleteTrainingField
);

export default trainingFieldRouter;
