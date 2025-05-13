import { ITrainingField } from '@/schemas/trainingField';
import { PaginateModel } from 'mongoose';
import { Schema, Types, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const trainingFieldSchema = new Schema<ITrainingField>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    universityIds: [{ type: Types.ObjectId, ref: 'University' }],
  },
  { timestamps: true, versionKey: false }
);

trainingFieldSchema.plugin(mongoosePaginate);

export const TrainingFieldModel = model<
  ITrainingField,
  PaginateModel<ITrainingField>
>('TrainingField', trainingFieldSchema);
