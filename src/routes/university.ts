import { univerCtrl } from '@/controllers/university';
import authenticate from '@/middlewares/authenticate';
import express from 'express';

const universityRouter = express.Router();

universityRouter.get('/universities', authenticate, univerCtrl.getUniversities);
universityRouter.get(
  '/university/:id',
  authenticate,
  univerCtrl.getUniversityById
);
universityRouter.post('/university', authenticate, univerCtrl.createUniversity);
universityRouter.patch(
  '/university/:id',
  authenticate,
  univerCtrl.updateUniversity
);
universityRouter.delete(
  '/university/:id',
  authenticate,
  univerCtrl.deleteUniversity
);
export default universityRouter;
