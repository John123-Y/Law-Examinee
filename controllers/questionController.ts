import { Request, Response, NextFunction } from 'express';
import Question from '../models/questionModel';
import AppError from '../utils/AppError';
import { questionSchema } from '../utils/validation';

export const createQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = questionSchema.validate(req.body);
    if (error) return next(new AppError(error.details[0].message, 400));

    if (!req.user!.isVerified) return next(new AppError('Please verify your email first', 403));
    const question = await Question.create({ ...req.body, createdBy: req.user!._id });
    res.status(201).json({ question });
  } catch (error) {
    next(new AppError('Failed to create question', 400));
  }
};


export const getQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user!.isVerified) return next(new AppError('Please verify your email first', 403));
    const questions = await Question.find()
      .populate('course', 'title')
      .populate('createdBy', 'name');
    res.status(200).json({ questions });
  } catch (error) {
    next(new AppError('Failed to fetch questions', 400));
  }
};

export const getQuestions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user!.isVerified) return next(new AppError('Please verify your email first', 403));
    const questions = await Question.find()
      .populate('course', 'title')
      .populate('createdBy', 'name');
    res.status(200).json({ questions });
  } catch (error) {
    next(new AppError('Failed to fetch questions', 400));
  }
};

export const updateQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = questionSchema.validate(req.body);
    if (error) return next(new AppError(error.details[0].message, 400));

    if (!req.user!.isVerified) return next(new AppError('Please verify your email first', 403));
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!question) return next(new AppError('Question not found', 404));
    res.status(200).json({ question });
  } catch (error) {
    next(new AppError('Failed to update question', 400));
  }
};

export const deleteQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user!.isVerified) return next(new AppError('Please verify your email first', 403));
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) return next(new AppError('Question not found', 404));
    res.status(204).json({ message: 'Question deleted' });
  } catch (error) {
    next(new AppError('Failed to delete question', 400));
  }
};