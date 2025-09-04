import express from 'express';
import { createExam, getExams, getExam, updateExam, deleteExam } from '../controllers/examController';
import { protect, restrictToAdmin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(getExams)
  .post(protect, restrictToAdmin, createExam);

router.route('/:id')
  .get(getExam)
  .patch(protect, restrictToAdmin, updateExam)
  .delete(protect, restrictToAdmin, deleteExam);

export default router;