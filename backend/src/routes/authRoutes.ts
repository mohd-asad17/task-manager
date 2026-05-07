import express from 'express';
import { signup, login, getMe } from '../controllers/authController.ts';
import { protect } from '../middleware/auth.ts';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);

export default router;
