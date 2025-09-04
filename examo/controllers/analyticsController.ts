import { Request, Response, NextFunction } from 'express';
import analyticsService from '../services/analyticsService';
import AppError from '../utils/AppError';

export const getPerformanceReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user!.isVerified) return next(new AppError('Please verify your email first', 403));
    const report = await analyticsService.getPerformanceReport(req.user!._id);
    res.status(200).json({ report });
  } catch (error) {
    next(new AppError('Failed to fetch performance report', 400));
  }
};