import { Schema, Types, model } from 'mongoose';

const categorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    universityIds: [{ type: Types.ObjectId, ref: 'University' }],
  },
  { timestamps: true, versionKey: false }
);

export const CategoryModel = model('Category', categorySchema);
