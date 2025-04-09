import { Types } from 'mongoose';
import { z } from 'zod';

const isObjectId = (val: string) => Types.ObjectId.isValid(val);

export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  universityIds: z
    .array(
      z.string().refine(
        (val) => isObjectId(val),
        (val) => ({
          message: `Invalid university ID: ${val}`,
        })
      )
    )
    .optional(),
});
