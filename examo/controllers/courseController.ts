import { Request, Response, NextFunction } from 'express';
import Course from '../models/courseModel';
import AppError from '../utils/AppError';
import { uploadImage } from '../utils/imageUpload';
import { courseSchema } from '../utils/validation';

export const createCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = courseSchema.validate(req.body);
    if (error) return next(new AppError(error.details[0].message, 400));

    if (!req.file) return next(new AppError('No image uploaded', 400));
    if (!req.user!.isVerified) return next(new AppError('Please verify your email first', 403));
    const imageUrl = await uploadImage(req.file.buffer);
    const course = await Course.create({
      ...req.body,
      image: imageUrl,
      createdBy: req.user!._id
    });
    res.status(201).json({ course });
  } catch (error) {
    next(new AppError('Failed to create course', 400));
  }
};

export const getCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user!.isVerified) return next(new AppError('Please verify your email first', 403));
    const courses = await Course.find().populate('createdBy', 'name');
    res.status(200).json({ courses });
  } catch (error) {
    next(new AppError('Failed to fetch courses', 400));
  }
};

export const getCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user!.isVerified) return next(new AppError('Please verify your email first', 403));
    const courses = await Course.find().populate('createdBy', 'name');
    res.status(200).json({ courses });
  } catch (error) {
    next(new AppError('Failed to fetch courses', 400));
  }
};

export const updateCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = courseSchema.validate(req.body);
    if (error) return next(new AppError(error.details[0].message, 400));

    if (!req.user!.isVerified) return next(new AppError('Please verify your email first', 403));
    let imageUrl;
    if (req.file) imageUrl = await uploadImage(req.file.buffer);
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { ...req.body, image: imageUrl || undefined },
      { new: true, runValidators: true }
    );
    if (!course) return next(new AppError('Course not found', 404));
    res.status(200).json({ course });
  } catch (error) {
    next(new AppError('Failed to update course', 400));
  }
};

export const deleteCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user!.isVerified) return next(new AppError('Please verify your email first', 403));
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return next(new AppError('Course not found', 404));
    res.status(204).json({ message: 'Course deleted' });
  } catch (error) {
    next(new AppError('Failed to delete course', 400));
  }
};

