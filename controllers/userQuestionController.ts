import { Request, Response, NextFunction } from 'express';
import Question from '../models/questionModel';
import Submission from '../models/submissionModel';
import AppError from '../utils/AppError';
import { submitAnswerSchema } from '../utils/validation';

export const getQuestions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user!.isVerified) return next(new AppError('Please verify your email first', 403));
    const query: any = {
      releaseDate: { $lte: Date.now() },
      $or: [{ expiryDate: { $exists: false } }, { expiryDate: { $gt: Date.now() } }]
    };
    if (!req.user!.isPremium) query.isPremium = false;

    const questions = await Question.find(query).populate('course', 'title').select('-correctAnswer -explanation');
    res.status(200).json({ questions });
  } catch (error) {
    next(new AppError('Failed to fetch questions', 400));
  }
};

export const submitAnswer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = submitAnswerSchema.validate(req.body);
    if (error) return next(new AppError(error.details[0].message, 400));

    if (!req.user!.isVerified) return next(new AppError('Please verify your email first', 403));
    const { questionId, selectedAnswer, timeTaken } = req.body;
    const question = await Question.findById(questionId);
    if (!question) return next(new AppError('Question not found', 404));

    const isCorrect = question.correctAnswer === selectedAnswer;
    const submission = await Submission.create({
      user: req.user!._id,
      question: questionId,
      selectedAnswer,
      isCorrect,
      timeTaken
    });

    res.status(200).json({ message: 'Answer submitted', submission });
  } catch (error) {
    next(new AppError('Failed to submit answer', 400));
  }
};