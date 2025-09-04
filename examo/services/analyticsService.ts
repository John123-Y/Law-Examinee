import mongoose, { Types } from 'mongoose';
import Submission from '../models/submissionModel';
import Question from '../models/questionModel';

export interface PerformanceReport {
  totalAttempts: number;
  correctAnswers: number;
  bySubject: { [key: string]: { total: number; correct: number } };
}

const getPerformanceReport = async (userId: Types.ObjectId): Promise<PerformanceReport> => {
  const submissions = await Submission.find({ user: userId }).populate('question');
  
  const report: PerformanceReport = {
    totalAttempts: submissions.length,
    correctAnswers: submissions.filter(sub => sub.isCorrect).length,
    bySubject: {}
  };

  for (const sub of submissions) {
    const question = await Question.findById(sub.question).populate('course', 'title');
    if (question && question.course) {
      const subject = (question.course as any).title;
      if (!report.bySubject[subject]) {
        report.bySubject[subject] = { total: 0, correct: 0 };
      }
      report.bySubject[subject].total++;
      if (sub.isCorrect) report.bySubject[subject].correct++;
    }
  }

  return report;
};

export default { getPerformanceReport }