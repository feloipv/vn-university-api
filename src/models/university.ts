import { IUniversity } from '@/schemas/university';
import { PaginateModel, Schema, Types, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const universitySchema = new Schema<IUniversity>(
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
      methods: [
        {
          _id: false,
          title: { type: String, required: true },
          description: { type: String },
          conditions: [{ type: String }],
          documents: [{ type: String }],
        },
      ],
    },
    trainingFields: [
      {
        _id: false,
        trainingFieldId: {
          type: Types.ObjectId,
          ref: 'TrainingField',
        },
        majors: [
          {
            _id: false,
            majorId: {
              type: Types.ObjectId,
              ref: 'Major',
            },
            scores: [
              {
                _id: false,
                year: { type: Number, required: true },
                thpt: { type: Number },
                hocBa: { type: Number },
              },
            ],
          },
        ],
      },
    ],
    campuses: [
      {
        _id: false,
        name: { type: String },
        address: { type: String },
        phone: { type: String },
        email: { type: String },
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

export const UniversityModel = model<IUniversity, PaginateModel<IUniversity>>(
  'University',
  universitySchema
);
