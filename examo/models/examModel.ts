import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IStudentRanking {
  user: Types.ObjectId;
  questions: {
    questionId: Types.ObjectId;
    answer: string;
    timeSpent: number;
    percentage: number;
  }[];
}

export interface IExam extends Document {
  course: Types.ObjectId;
  year: number;
  user: Types.ObjectId;
  rankings: IStudentRanking[];
  createdAt: Date;
  updatedAt: Date;
}

const examSchema = new Schema<IExam>({
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  year: { type: Number, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rankings: [{
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    questions: [{
      questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
      answer: { type: String, required: true },
      timeSpent: { type: Number, required: true },
      percentage: { type: Number, required: true }
    }]
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IExam>('Exam', examSchema);