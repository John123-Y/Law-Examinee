import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IQuestion extends Document {
  course: Types.ObjectId;
  question: string;
  options: string[];
  correctAnswer: string;
  caseStudy?: string;
  years: number[];
  explanation: string;
  isPremium: boolean;
  releaseDate?: Date;
  expiryDate?: Date;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const questionSchema = new Schema<IQuestion>({
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  caseStudy: { type: String },
  years: [{ type: Number, required: true }],
  explanation: { type: String, required: true },
  isPremium: { type: Boolean, default: false },
  releaseDate: { type: Date, default: null },
  expiryDate: { type: Date, default: null },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IQuestion>('Question', questionSchema);