import { model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { PaginateModel } from 'mongoose';
import { IUser } from '@/schemas/auth';

const userSchema = new Schema<IUser>(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    avatar: { type: String, default: '' },
    favoriteUniversityIds: [{ type: Schema.Types.ObjectId, ref: 'University' }],
    otp: { type: String },
    otpExpiresAt: { type: Date },
    isActivate: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.plugin(mongoosePaginate);

export const UserModel = model<IUser, PaginateModel<IUser>>('User', userSchema);
