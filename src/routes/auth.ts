import { authCtrl } from '@/controllers/auth';
import authenticate from '@/middlewares/authenticate';
import upload from '@/middlewares/upload';
import verifyOtp from '@/middlewares/verifyOtp';
import express from 'express';

const authRouter = express.Router();

authRouter.post('/auth/signup', authCtrl.signup);
authRouter.post('/auth/signin', authCtrl.signin);
authRouter.post('/auth/signout', authCtrl.signout);
authRouter.post('/auth/activate-user', verifyOtp, authCtrl.activateUser);
authRouter.post('/auth/send-OTP', authCtrl.sendOTP);
authRouter.post('/auth/reset-password', verifyOtp, authCtrl.resetPassword);
authRouter.post('/auth/refresh-token', authCtrl.refreshToken);
authRouter.get('/user/profile', authenticate, authCtrl.getUserProfile);
authRouter.post(
  '/user/upload-avatar',
  authenticate,
  upload.single('avatar'),
  authCtrl.uploadAvatar
);

export default authRouter;
