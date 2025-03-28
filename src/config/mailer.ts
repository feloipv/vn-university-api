import { CustomError } from '@/utils/errorUtils';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (email: string, otp: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Account Activation',
    text: `Your verification code is: ${otp}. This code will expire in 5 minutes.`,
  };

  const result = await transporter.sendMail(mailOptions);

  if (result.rejected.length > 0) {
    throw new CustomError(
      `Email rejected for: ${result.rejected.join(', ')}`,
      400,
      [result.response]
    );
  }
  return true;
};

export default sendEmail;
