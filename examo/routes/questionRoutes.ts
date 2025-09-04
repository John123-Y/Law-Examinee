import express from 'express';
import { createQuestion, getQuestions, getQuestion, updateQuestion, deleteQuestion } from '../controllers/questionController';
import { protect, restrictToAdmin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(protect, restrictToAdmin, getQuestions)
  .post(protect, restrictToAdmin, createQuestion);

router.route('/:id')
  .get(protect, restrictToAdmin, getQuestion)
  .patch(protect, restrictToAdmin, updateQuestion)
  .delete(protect, restrictToAdmin, deleteQuestion);

export default router;