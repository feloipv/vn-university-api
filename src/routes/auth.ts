import { authCtrl } from '@/controllers/auth';
import express from 'express';

const authRouter = express.Router();

authRouter.post('/auth/signup', authCtrl.signup);
authRouter.post('/auth/signin', authCtrl.signin);
authRouter.post('/auth/activate_user', authCtrl.activateUser);
authRouter.post('/auth/resend_OTP', authCtrl.resendOTP);

export default authRouter;
