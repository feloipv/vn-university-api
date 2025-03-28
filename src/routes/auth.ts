import { authCtrl } from '@/controllers/auth';
import express from 'express';

const authRouter = express.Router();

authRouter.post('/auth/signup', authCtrl.signup);

export default authRouter;
