import { ZodSchema } from 'zod';
import { CustomError } from './errorUtils';

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
