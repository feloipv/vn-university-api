import { univerCtrl } from '@/controllers/university';
import authenticate from '@/middlewares/authenticate';
import express from 'express';

const univerRouter = express.Router();

univerRouter.post('/university', authenticate, univerCtrl.createUniversity);
univerRouter.patch(
  '/university/:id',
  authenticate,
  univerCtrl.updateUniversity
);

export default univerRouter;
