import { z } from 'zod';

export const userSchema = z.object({
  userName: z
    .string({ required_error: 'Username is required' })
    .min(
      3,
      'Username must be at least 3 characters long for better readability'
    )
    .max(30, 'Username cannot exceed 30 characters to maintain consistency'),
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email format. Please enter a valid email address'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters long for security reasons')
    .max(50, 'Password cannot exceed 50 characters to avoid complexity'),
  role: z
    .enum(['user', 'admin'], {
      required_error: 'User role is required',
      invalid_type_error: 'Role must be either "user" or "admin"',
    })
    .default('user'),
  avatar: z
    .string({ required_error: 'Avatar URL is required' })
    .url('Avatar URL must be a valid link starting with http:// or https://')
    .nullable(),
  favorites: z
    .array(
      z
        .string()
        .length(24, 'Each favorite ID must be a valid 24-character ObjectId')
    )
    .default([]),
  otp: z
    .string({
      required_error: 'OTP is required for verification',
      invalid_type_error: 'OTP must be a string containing exactly 6 digits',
    })
    .regex(/^\d{6}$/, 'OTP must be exactly 6 digits (e.g., 123456)')
    .nullable(),
  otpExpiresAt: z
    .date({ required_error: 'OTP expiration date is required' })
    .nullable()
    .refine((date) => date && date > new Date(), {
      message: 'OTP expiration date must be in the future',
      path: ['otpExpiresAt'],
    }),
  isActivate: z.boolean().default(false),
});

export const signupSchema = userSchema
  .pick({ userName: true, email: true, password: true })
  .extend({
    confirmPassword: z
      .string({ required_error: 'Confirm password is required' })
      .min(6, 'Confirm password must be at least 6 characters long'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message:
      'Passwords do not match. Please ensure both passwords are identical',
    path: ['confirmPassword'],
  });

export const resetPasswordSchema = signupSchema._def.schema
  .pick({
    password: true,
    confirmPassword: true,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message:
      'Passwords do not match. Please ensure both passwords are identical',
    path: ['confirmPassword'],
  });

export const sendOtpSchema = userSchema.pick({ email: true });

export const verifyOtpSchema = userSchema
  .pick({ email: true, otp: true })
  .extend({
    otp: userSchema.shape.otp.unwrap().nonempty('OTP is required'),
  });

export const signinSchema = userSchema.pick({ email: true, password: true });
