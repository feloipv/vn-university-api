import z, { ZodSchema } from 'zod';
import { CustomError } from './errorUtils';
import { Types } from 'mongoose';

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

export const isObjectId = (fieldName: string = 'ID') =>
  z
    .string({
      required_error: `${fieldName} must be a string`,
      invalid_type_error: `${fieldName} must be a string`,
    })
    .refine(
      (val) => Types.ObjectId.isValid(val),
      (val) => {
        return {
          message: `Invalid ${fieldName}: ${val}`,
        };
      }
    );
