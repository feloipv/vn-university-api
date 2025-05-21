import { isObjectId } from '@/utils/ValidateUtils';
import { z } from 'zod';

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

  universityIds: z.array(isObjectId('University ID')).optional(),
  majorIds: z.array(isObjectId('Major Id')).optional(),
});

export type ITrainingField = z.infer<typeof trainingFieldSchema>;
