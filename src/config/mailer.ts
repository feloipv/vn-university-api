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
    from: String(process.env.EMAIL_USER),
    to: email,
    subject: 'Your One-Time Password (OTP)',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px; margin: auto; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #2d89ef; text-align: center;">Your OTP Code</h2>
        <p>Hello,</p>
        <p>Your One-Time Password (OTP) is:</p>
        <p style="font-size: 24px; font-weight: bold; color: #2d89ef; text-align: center;">${otp}</p>
        <p>This code is valid for <strong>5 minutes</strong>. Please do not share it with anyone.</p>
        <p>If you did not request this code, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #ddd;">
        <p style="text-align: center; color: #888; font-size: 12px;">&copy; ${new Date().getFullYear()} [Your Company Name]. All rights reserved.</p>
      </div>
    `,
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
