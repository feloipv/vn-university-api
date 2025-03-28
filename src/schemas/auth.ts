import { CustomError } from '@/utils/errorUtils';
import { z } from 'zod';
import { ZodSchema } from 'zod';

export const userSchema = z.object({
  userName: z
    .string({ required_error: 'Tên người dùng là bắt buộc' })
    .min(3, 'Tên người dùng phải có ít nhất 3 ký tự')
    .max(30, 'Tên quá dài'),
  email: z.string().email('Email không hợp lệ'),
  password: z
    .string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .max(50, 'Mật khẩu quá dài'),
  role: z.enum(['user', 'admin']).default('user'),
  avatar: z.string().url('Ảnh đại diện phải là URL hợp lệ').optional(),
  favorites: z.array(z.string().length(24, 'ID không hợp lệ')).default([]),
  otp: z.string().optional(),
  otpExpiresAt: z.date().optional(),
  isActivate: z.boolean().default(false),
});

export const signupSchema = userSchema
  .pick({ userName: true, email: true, password: true })
  .extend({
    confirmPassword: z
      .string()
      .min(6, 'Xác nhận mật khẩu phải có ít nhất 6 ký tự'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

export const validateData = <T>(schema: ZodSchema<T>, data: unknown): T => {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new CustomError(
      'Validation Error',
      400,
      result.error.errors.map((err) => err.message)
    );
  }
  return result.data;
};

export type UserType = z.infer<typeof userSchema>;
