import { IuniversitySchema } from '@/schemas/university';
import { Schema, Types, model } from 'mongoose';

const universitySchema = new Schema<IuniversitySchema>(
  {
    name: { type: String, required: true },
    categoryIds: [
      {
        type: Types.ObjectId,
        ref: 'Category',
      },
    ],
    code: { type: String },
    location: { type: String, required: true },
    city: { type: String },
    type: {
      type: String,
      enum: ['public', 'private', 'international'],
      default: 'public',
    },
    establishedYear: { type: Number },
    description: { type: String },
    website: { type: String },
    logo: { type: String },
    email: { type: String },
    phone: { type: String },
    admissionInfo: {
      admissionMethod: { type: [String] },
      admissionLink: { type: String },
    },
    trainingFields: { type: [String] },
    tuition: {
      min: { type: Number },
      unit: { type: String, default: 'VND/year' },
    },
    rating: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const UniversityModel = model<IuniversitySchema>(
  'University',
  universitySchema
);
