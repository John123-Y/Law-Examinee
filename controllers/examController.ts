import { Request, Response, NextFunction } from 'express';
import Exam from '../models/examModel';
import AppError from '../utils/AppError';
import { examSchema } from '../utils/validation';

export const createExam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = examSchema.validate(req.body);
    if (error) return next(new AppError(error.details[0].message, 400));

    if (!req.user!.isVerified) return next(new AppError('Please verify your email first', 403));
    const exam = await Exam.create({ ...req.body, createdBy: req.user!._id });
    res.status(201).json({ exam });
  } catch (error) {
    next(new AppError('Failed to create exam', 400));
  }
};

export const getExam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user!.isVerified) return next(new AppError('Please verify your email first', 403));
    const query: any = {};
    if (!req.user!.isPremium) query.isPremium = false;
    const exams = await Exam.find(query).populate('course', 'title').populate('createdBy', 'name');
    res.status(200).json({ exams });
  } catch (error) {
    next(new AppError('Failed to fetch exams', 400));
  }
};

export const getExams = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user!.isVerified) return next(new AppError('Please verify your email first', 403));
    const query: any = {};
    if (!req.user!.isPremium) query.isPremium = false;
    const exams = await Exam.find(query).populate('course', 'title').populate('createdBy', 'name');
    res.status(200).json({ exams });
  } catch (error) {
    next(new AppError('Failed to fetch exams', 400));
  }
};

export const updateExam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = examSchema.validate(req.body);
    if (error) return next(new AppError(error.details[0].message, 400));

    if (!req.user!.isVerified) return next(new AppError('Please verify your email first', 403));
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!exam) return next(new AppError('Exam not found', 404));
    res.status(200).json({ exam });
  } catch (error) {
    next(new AppError('Failed to update exam', 400));
  }
};

export const deleteExam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user!.isVerified) return next(new AppError('Please verify your email first', 403));
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) return next(new AppError('Exam not found', 404));
    res.status(204).json({ message: 'Exam deleted' });
  } catch (error) {
    next(new AppError('Failed to delete exam', 400));
  }
};