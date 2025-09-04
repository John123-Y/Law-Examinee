import { Router } from 'express';
import { getQuestions, submitAnswer } from '../controllers/userQuestionController';
import { protect, restrictToVerified } from '../middleware/authMiddleware';

const router = Router();

router.get('/', protect, restrictToVerified, getQuestions);
router.post('/submit', protect, restrictToVerified, submitAnswer);
router.get('/hot-topics', protect, restrictToVerified, async (req, res, next) => {
  try {
    const aiAnalysis = require('../utils/aiAnalysis').default;
    const topics = await aiAnalysis.getHotTopics();
    res.status(200).json(topics);
  } catch (error) {
    next(error);
  }
});

export default router;