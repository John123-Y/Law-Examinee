import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import AppError from '../utils/AppError';

export interface Request extends Request {
  user?: any;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.startsWith('Bearer') ? req.headers.authorization.split(' ')[1] : null;
    if (!token) return next(new AppError('Not authenticated', 401));
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string };
    const user = await User.findById(decoded.id);
    if (!user) return next(new AppError('User not found', 404));
    
    req.user = user;
    next();
  } catch (error) {
    next(new AppError('Invalid token', 401));
  }
};

export const restrictToAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') return next(new AppError('Only admins can perform this action', 403));
  next();
};

export const restrictToVerified = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.isVerified) return next(new AppError('Please verify your email first', 403));
  next();
};

export default 'errorMiddleWare';
