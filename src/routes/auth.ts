import { authCtrl } from '@/controllers/auth';
import verifyOtp from '@/middlewares/verifyOtp';
import express from 'express';

const authRouter = express.Router();

authRouter.post('/auth/signup', authCtrl.signup);
authRouter.post('/auth/signin', authCtrl.signin);
authRouter.post('/auth/activate_user', verifyOtp, authCtrl.activateUser);
authRouter.post('/auth/send_OTP', authCtrl.sendOTP);
authRouter.post('/auth/reset_password', verifyOtp, authCtrl.resetPassword);

export default authRouter;
