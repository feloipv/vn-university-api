import { tfCtrl } from '@/controllers/trainingField';
import authenticate from '@/middlewares/authenticate';
import express from 'express';

const trainingFieldRouter = express.Router();

trainingFieldRouter.get(
  '/training-fields',
  authenticate,
  tfCtrl.getTrainingField
);
trainingFieldRouter.get(
  '/training-field/:id',
  authenticate,
  tfCtrl.getTrainingFieldById
);
trainingFieldRouter.post(
  '/training-field',
  authenticate,
  tfCtrl.createTrainingField
);
trainingFieldRouter.patch(
  '/training-field/:id',
  authenticate,
  tfCtrl.updateTrainingField
);
trainingFieldRouter.delete(
  '/training-field/:id',
  authenticate,
  tfCtrl.deleteTrainingField
);

export default trainingFieldRouter;
