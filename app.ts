import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { Request, Response, NextFunction } from 'express';
import authRoutes from './routes/authRoutes';
import courseRoutes from './routes/courseRoutes';
import examRoutes from './routes/examRoutes';
import questionRoutes from './routes/questionRoutes';
import userQuestionRoutes from './routes/userQuestionRoutes';
import paymentRoutes from './routes/paymentRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import errorMiddleware from './middleware/errorMiddleware';
import { connectDB } from './config/db';

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files (CSS, compiled JS)
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

connectDB();


app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/user/questions', userQuestionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/', (req: Request, res: Response) => res.render('index'));
app.get('/practice', (req: Request, res: Response) => res.render('practice'));
app.get('/payment', (req: Request, res: Response) => res.render('payment'));
app.get('/success', (req: Request, res: Response) => res.render('success'));
app.get('/admin', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const User = require('./models/userModel').default;
    const Question = require('./models/questionModel').default;
    const Transaction = require('./models/transactionModel').default;
    const users = await User.find().select('-password');
    const questions = await Question.find().populate('course', 'title').populate('createdBy', 'name');
    const transactions = await Transaction.find().populate('user', 'name email');
    res.render('admin', { users, questions, transactions, user: req.user });
  } catch (error) {
    next(error);
  }
});
app.get('/analytics', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const analyticsService = require('./services/analyticsService').default;
    const aiAnalysis = require('./utils/aiAnalysis').default;
    const report = await analyticsService.getPerformanceReport(req.user!._id);
    const hotTopics = await aiAnalysis.getHotTopics();
    res.render('analytics', { report, hotTopics, user: req.user });
  } catch (error) {
    next(error);
  }
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on port ${PORT}'));

export default app;