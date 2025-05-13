import { Iuniversity } from '@/schemas/university';
import { PaginateModel, Schema, Types, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const universitySchema = new Schema<Iuniversity>(
  {
    name: { type: String, required: true },
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
    trainingFieldIds: [
      {
        type: Types.ObjectId,
        ref: 'TrainingField',
      },
    ],
    tuition: {
      min: { type: Number },
      max: { type: Number },
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

universitySchema.plugin(mongoosePaginate);

export const UniversityModel = model<Iuniversity, PaginateModel<Iuniversity>>(
  'University',
  universitySchema
);
