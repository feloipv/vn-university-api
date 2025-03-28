import { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  userName: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  avatar?: string;
  favorites: Schema.Types.ObjectId[];
  otp?: string;
  otpExpiresAt?: Date;
  isActivate: boolean;
  createdAt: Date;
  updatedAt: Date;
}
