import { isObjectId } from '@/utils/ValidateUtils';
import { z } from 'zod';

export const majorSchema = z.object({
  name: z.string({
    required_error: 'Major name is required',
    invalid_type_error: 'Major name must be a string',
  }),
  description: z.string().optional(),
  trainingFieldIds: z.array(isObjectId('Training field ID')).optional(),
});

export type IMajor = z.infer<typeof majorSchema>;
