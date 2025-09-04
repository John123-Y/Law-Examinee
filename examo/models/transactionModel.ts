import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITransaction extends Document {
  user: Types.ObjectId;
  reference: string;
  amount: number;
  type: string;
  status: 'pending' | 'success' | 'failed';
  createdAt: Date;
}

const transactionSchema = new Schema<ITransaction>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reference: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  type: { type: String, required: true },
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ITransaction>('Transaction', transactionSchema);