import express from 'express';
import { getDashboardStats, getTeamMembers } from '../controllers/dashboardController.ts';
import { protect } from '../middleware/auth.ts';

const router = express.Router();

router.use(protect);

router.get('/stats', getDashboardStats);
router.get('/users', getTeamMembers);

export default router;
