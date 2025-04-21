import { authCtrl } from '@/controllers/auth';
import authenticate from '@/middlewares/authenticate';
import verifyOtp from '@/middlewares/verifyOtp';
import express from 'express';

const authRouter = express.Router();

authRouter.post('/auth/signup', authCtrl.signup);
authRouter.post('/auth/signin', authCtrl.signin);
authRouter.post('/auth/signout', authCtrl.signout);
authRouter.post('/auth/activate_user', verifyOtp, authCtrl.activateUser);
authRouter.post('/auth/send_OTP', authCtrl.sendOTP);
authRouter.post('/auth/reset_password', verifyOtp, authCtrl.resetPassword);
authRouter.post('/auth/refresh_token', authenticate, authCtrl.refreshToken);

export default authRouter;
