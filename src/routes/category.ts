import { cateCtrl } from '@/controllers/category';
import authenticate from '@/middlewares/authenticate';
import express from 'express';

const cateRouter = express.Router();

cateRouter.post('/categories', authenticate, cateCtrl.createCategory);
cateRouter.patch('/categories/:id', authenticate, cateCtrl.updateCategory);
cateRouter.delete('/categories/:id', authenticate, cateCtrl.deleteCategory);

export default cateRouter;
