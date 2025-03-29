import signup from '@/controllers/auth/signup';
import resendOTP from '@/controllers/auth/resendOTP';
import activateUser from '@/controllers/auth/activateUser';
import signin from '@/controllers/auth/signin';

export const authCtrl = { signup, resendOTP, activateUser, signin };
