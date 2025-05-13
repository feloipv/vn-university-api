import { Types } from 'mongoose';
import { z } from 'zod';

const isObjectId = (val: string) => Types.ObjectId.isValid(val);

export const trainingFieldSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string',
    })
    .min(1, 'Name is required'),

  description: z
    .string({
      invalid_type_error: 'Description must be a string',
    })
    .optional(),

  universityIds: z
    .array(
      z
        .string({
          required_error: 'University ID must be a string',
          invalid_type_error: 'University ID must be a string',
        })
        .refine(
          (val) => isObjectId(val),
          (val) => ({
            message: `Invalid training field ID: ${val}`,
          })
        )
    )
    .optional(),
});

export const createTrainingFieldschema = trainingFieldSchema.pick({
  name: true,
  description: true,
});

export type ITrainingField = z.infer<typeof trainingFieldSchema>;
