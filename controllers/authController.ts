import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import Otp from '../models/otpModels';
import emailService from '../services/emailService';
import AppError from '../utils/AppError';
import { registerSchema, loginSchema, verifyEmailSchema, forgotPasswordSchema, resetPasswordSchema } from '../utils/validation';

export const register = async (req: Request.headers, res: Response, next: NextFunction) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) return next(new AppError(error.details[0].message, 400));

    const { email, password, name } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return next(new AppError('Email already exists', 400));

    const user = await User.create({ email, password, name });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await Otp.create({ email, otp, type: 'email_verification', expiresAt: Date.now() + 10 * 60 * 1000 });

    await emailService.sendOtpEmail(email, otp, 'email_verification');
    await emailService.sendWelcomeEmail(email, name);

    res.status(201).json({ message: 'User registered. Please verify your email.' });
  } catch (error) {
    next(new AppError('Failed to register user', 400));
  }
};

export const verifyEmail = async (req: Request.headers, res: Response, next: NextFunction) => {
  try {
    const { error } = verifyEmailSchema.validate(req.body);
    if (error) return next(new AppError(error.details[0].message, 400));

    const { email, otp } = req.body;
    const otpRecord = await Otp.findOne({ email, otp, type: 'email_verification', expiresAt: { $gt: Date.now() } });
    if (!otpRecord) return next(new AppError('Invalid or expired OTP', 400));

    const user = await User.findOneAndUpdate({ email }, { isVerified: true }, { new: true });
    if (!user) return next(new AppError('User not found', 404));

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    await Otp.deleteOne({ email, otp });

    res.status(200).json({ message: 'Email verified successfully', token });
  } catch (error) {
    next(new AppError('Failed to verify email', 400));
  }
};

export const login = async (req: Request.headers, res: Response, next: NextFunction) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) return next(new AppError(error.details[0].message, 400));

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Invalid email or password', 401));
    }
    if (!user.isVerified) return next(new AppError('Please verify your email first', 403));

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    next(new AppError('Failed to login', 400));
  }
};

export const forgotPassword = async (req: Request.headers, res: Response, next: NextFunction) => {
  try {
    const { error } = forgotPasswordSchema.validate(req.body);
    if (error) return next(new AppError(error.details[0].message, 400));

    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(new AppError('No user found with this email', 404));

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await Otp.create({ email, otp, type: 'password_reset', expiresAt: Date.now() + 10 * 60 * 1000 });

    await emailService.sendOtpEmail(email, otp, 'password_reset');
    res.status(200).json({ message: 'Password reset OTP sent to your email' });
  } catch (error) {
    next(new AppError('Failed to process forgot password request', 400));
  }
};
export const resetPassword = async (req: Request.headers, res: Response, next: NextFunction) => {
  try {
    const { error } = resetPasswordSchema.validate(req.body);
    if (error) return next(new AppError(error.details[0].message, 400));

    const { email, otp, newPassword } = req.body;
    const otpRecord = await Otp.findOne({ email, otp, type: 'password_reset', expiresAt: { $gt: Date.now() } });
    if (!otpRecord) return next(new AppError('Invalid or expired OTP', 400));

    const user = await User.findOne({ email });
    if (!user) return next(new AppError('User not found', 404));

    user.password = newPassword;
    await user.save();
    await Otp.deleteOne({ email, otp });

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    next(new AppError('Failed to reset password', 400));
  }
};