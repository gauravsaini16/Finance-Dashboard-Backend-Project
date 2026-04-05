import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  toggleUserStatus,
  deleteUser
} from '../controllers/UserController.js';
import { protect } from '../middlewares/auth.js';
import { requireRole } from '../middlewares/rbac.js';

const router = express.Router();

router.use(protect);

router.get('/', requireRole('admin'), getAllUsers);
router.get('/:id', requireRole('admin'), getUserById);
router.patch('/:id/role', requireRole('admin'), updateUserRole);
router.patch('/:id/status', requireRole('admin'), toggleUserStatus);
router.delete('/:id', requireRole('admin'), deleteUser);

export default router;