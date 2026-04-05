import express from 'express';
import {
  getSummary,
  getCategoryTotals,
  getMonthlyTrends,
  getRecentActivity,
  getFullDashboard,
} from '../controllers/DashboardController.js';
import { protect } from '../middlewares/auth.js';
import { requireRole } from '../middlewares/rbac.js';

const router = express.Router();

router.use(protect);
router.use(requireRole('admin', 'analyst'));

router.get('/', getFullDashboard);
router.get('/summary', getSummary);
router.get('/categories', getCategoryTotals);
router.get('/trends', getMonthlyTrends);
router.get('/recent', getRecentActivity);

export default router;