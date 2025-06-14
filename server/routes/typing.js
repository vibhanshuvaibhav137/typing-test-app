import express from 'express';
import { saveTypingData, getTypingHistory } from '../controllers/typingController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/save', authMiddleware, saveTypingData);
router.get('/history', authMiddleware, getTypingHistory);

export default router;
