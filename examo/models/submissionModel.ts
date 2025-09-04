import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ISubmission extends Document {
  user: Types.ObjectId;
  question: Types.ObjectId;
  selectedAnswer: string;
  isCorrect: boolean;
  timeTaken: number;
  createdAt: Date;
}

const submissionSchema = new Schema<ISubmission>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  question: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
  selectedAnswer: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
  timeTaken: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ISubmission>('Submission', submissionSchema);