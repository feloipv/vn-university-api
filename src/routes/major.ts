import { majorCtrl } from '@/controllers/major';
import authenticate from '@/middlewares/authenticate';
import express from 'express';

const majorRouter = express.Router();

majorRouter.get('/majors', authenticate, majorCtrl.getMajor);
majorRouter.get('/major/:id', authenticate, majorCtrl.getMajorById);
majorRouter.post('/major', authenticate, majorCtrl.createMajor);
majorRouter.patch('/major/:id', authenticate, majorCtrl.updateMajor);
majorRouter.delete('/major/:id', authenticate, majorCtrl.deleteMajor);

export default majorRouter;
