import signup from '@/controllers/auth/signup';
import resendOTP from '@/controllers/auth/resendOTP';
import activateUser from '@/controllers/auth/activateUser';
import signin from '@/controllers/auth/signin';
import resetPassword from './resetPassword';

export const authCtrl = {
  signup,
  resendOTP,
  activateUser,
  signin,
  resetPassword,
};
