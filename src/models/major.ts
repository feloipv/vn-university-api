import { IMajor } from '@/schemas/major';
import { PaginateModel } from 'mongoose';
import { Schema, Types, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const majorSchema = new Schema<IMajor>(
  {
    name: { type: String, required: true },
    description: { type: String },
    trainingFieldIds: [{ type: Types.ObjectId, ref: 'TrainingField' }],
  },
  { timestamps: true, versionKey: false }
);

majorSchema.plugin(mongoosePaginate);

export const MajorModel = model<IMajor, PaginateModel<IMajor>>(
  'Major',
  majorSchema
);
