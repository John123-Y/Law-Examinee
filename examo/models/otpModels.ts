import mongoose, { Schema, Document } from 'mongoose';

export interface IOtp extends Document {
  email: string;
  otp: string;
  type: 'email_verification' | 'password_reset';
  expiresAt: number;
}

const otpSchema = new Schema<IOtp>({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  type: { type: String, enum: ['email_verification', 'password_reset'], required: true },
  expiresAt: { type: Number, required: true }
});

export default mongoose.model<IOtp>('Otp', otpSchema);