import signup from '@/controllers/auth/signup';
import sendOTP from '@/controllers/auth/sendOTP';
import activateUser from '@/controllers/auth/activateUser';
import signin from '@/controllers/auth/signin';
import resetPassword from './resetPassword';

export const authCtrl = {
  signup,
  sendOTP,
  activateUser,
  signin,
  resetPassword,
};
