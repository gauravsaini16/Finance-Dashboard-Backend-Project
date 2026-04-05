import express from 'express';
import {
  createRecord,
  getAllRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
} from '../controllers/RecordController.js';
import { protect } from '../middlewares/auth.js';
import { requireRole } from '../middlewares/rbac.js';

const router = express.Router();

router.use(protect);

router.get('/', requireRole('admin', 'analyst'), getAllRecords);
router.get('/:id', requireRole('admin', 'analyst'), getRecordById);
router.post('/', requireRole('admin'), createRecord);
router.put('/:id', requireRole('admin'), updateRecord);
router.delete('/:id', requireRole('admin'), deleteRecord);

export default router;