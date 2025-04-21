import { univerCtrl } from '@/controllers/university';
import authenticate from '@/middlewares/authenticate';
import express from 'express';

const univerRouter = express.Router();

univerRouter.get('/university', authenticate, univerCtrl.getUniversities);
univerRouter.post('/university', authenticate, univerCtrl.createUniversity);
univerRouter.patch(
  '/university/:id',
  authenticate,
  univerCtrl.updateUniversity
);
univerRouter.delete(
  '/university/:id',
  authenticate,
  univerCtrl.deleteUniversity
);
export default univerRouter;
