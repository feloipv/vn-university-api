import { isObjectId } from '@/utils/ValidateUtils';
import { z } from 'zod';

export const universitySchema = z.object({
  name: z.string({
    required_error: 'University name is required',
    invalid_type_error: 'University name must be a string',
  }),
  code: z.string().optional(),
  location: z.string({
    required_error: 'Location is required',
    invalid_type_error: 'Location must be a string',
  }),
  city: z.string().optional(),
  type: z.enum(['public', 'private', 'international'], {
    required_error: 'Type is required',
    invalid_type_error: 'Type must be public, private, or international',
  }),
  establishedYear: z
    .number()
    .int()
    .min(1000)
    .max(new Date().getFullYear())
    .optional(),
  description: z.string().optional(),
  website: z.string().url('Website must be a valid URL').optional(),
  logo: z.string().url('Logo must be a valid URL').optional(),
  email: z.string().email('Invalid email format').optional(),
  phone: z.string().optional(),

  admissionInfo: z
    .object({
      methods: z
        .array(
          z.object({
            title: z.string(),
            description: z.string().optional(),
            conditions: z.array(z.string()).optional(),
            documents: z.array(z.string()).optional(),
          })
        )
        .optional(),
    })
    .optional(),

  trainingFields: z
    .array(
      z.object({
        trainingFieldId: isObjectId('Training field ID'),
        majors: z.array(
          z.object({
            majorId: isObjectId('Major ID'),
            scores: z
              .array(
                z.object({
                  year: z.number({
                    required_error: 'Year is required',
                  }),
                  thpt: z.number().optional(),
                  hocBa: z.number().optional(),
                })
              )
              .optional(),
          })
        ),
      })
    )
    .optional(),

  campuses: z
    .array(
      z.object({
        name: z.string().optional(),
        address: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
      })
    )
    .optional(),

  tuition: z
    .object({
      min: z.number({
        required_error: 'Minimum tuition is required',
      }),
      max: z.number({
        required_error: 'Maximum tuition is required',
      }),
      unit: z.string().default('VND/year'),
    })
    .optional(),

  rating: z.number().min(0).max(5).default(0),
  isFeatured: z.boolean().default(false),
});

export type IUniversity = z.infer<typeof universitySchema>;
