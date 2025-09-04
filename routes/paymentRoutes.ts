import express from 'express';
import { initiatePayment, handleCallback } from '../controllers/paymentController';
import { protect, restrictToVerified } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/pay', protect, restrictToVerified, initiatePayment);
router.get('/callback', handleCallback);

export default router;