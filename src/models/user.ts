import { model, Schema } from 'mongoose';
import { IUser } from '@/interfaces/auth';

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
    favorites: [{ type: Schema.Types.ObjectId, ref: 'University' }],
    otp: { type: String },
    otpExpiresAt: { type: Date },
    isActivate: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const User = model<IUser>('User', userSchema);
export default User;
