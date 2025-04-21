import { ICategory } from '@/schemas/category';
import { PaginateModel } from 'mongoose';
import { Schema, Types, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    universityIds: [{ type: Types.ObjectId, ref: 'University' }],
  },
  { timestamps: true, versionKey: false }
);

categorySchema.plugin(mongoosePaginate);

export const CategoryModel = model<ICategory, PaginateModel<ICategory>>(
  'Category',
  categorySchema
);
