import { cateCtrl } from '@/controllers/category';
import authenticate from '@/middlewares/authenticate';
import express from 'express';

const cateRouter = express.Router();

cateRouter.post('/categories', authenticate, cateCtrl.addCategory);

export default cateRouter;
