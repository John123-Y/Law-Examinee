import { Request, Response, NextFunction } from 'express';
import paystack from '../config/paystack';
import Transaction from '../models/transactionModel';
import User from '../models/userModel';
import emailService from '../services/emailService';
import AppError from '../utils/AppError';
import { paymentSchema } from '../utils/validation';

export const initiatePayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = paymentSchema.validate(req.body);
    if (error) return next(new AppError(error.details[0].message, 400));

    if (!req.user!.isVerified) return next(new AppError('Please verify your email first', 403));
    const { amount, type } = req.body;
    const payment = await paystack.transaction.initialize({
      email: req.user!.email,
      amount: amount * 100, // Convert to kobo
      callback_url: process.env.CALLBACK_URL!
    });

    const transaction = await Transaction.create({
      user: req.user!._id,
      reference: payment.data.reference,
      amount,
      type,
      status: 'pending'
    });

    res.status(200).json({ url: payment.data.authorization_url, transaction });
  } catch (error) {
    next(new AppError('Failed to initiate payment', 400));
  }
};

export const handleCallback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reference } = req.query;
    if (!reference || typeof reference !== 'string') return next(new AppError('Invalid reference', 400));

    const verification = await paystack.transaction.verify(reference);
    if (!verification.status || verification.data.status !== 'success') {
      return next(new AppError('Payment verification failed', 400));
    }

    const transaction = await Transaction.findOneAndUpdate(
      { reference },
      { status: 'success' },
      { new: true }
    );
    if (!transaction) return next(new AppError('Transaction not found', 404));

    await User.findByIdAndUpdate(transaction.user, { isPremium: true });
    await emailService.sendPaymentConfirmationEmail(verification.data.customer.email, verification.data.amount);

    res.redirect('/success');
  } catch (error) {
    next(new AppError('Failed to verify payment', 400));
  }
};