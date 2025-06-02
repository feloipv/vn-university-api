import signup from '@/controllers/auth/signup';
import sendOTP from '@/controllers/auth/sendOTP';
import activateUser from '@/controllers/auth/activateUser';
import signin from '@/controllers/auth/signin';
import resetPassword from '@/controllers/auth/resetPassword';
import signout from '@/controllers/auth/signout';
import refreshToken from '@/controllers/auth/refreshToken';
import getUserProfile from './getUserProfile';
import uploadAvatar from './uploadAvata';

export const authCtrl = {
  signup,
  sendOTP,
  signout,
  activateUser,
  signin,
  resetPassword,
  refreshToken,
  getUserProfile,
  uploadAvatar,
};
