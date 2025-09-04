import express from 'express';
import { getPerformanceReport } from '../controllers/analyticsController';
import { protect, restrictToVerified } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/performance', protect, restrictToVerified, getPerformanceReport);

export default router;