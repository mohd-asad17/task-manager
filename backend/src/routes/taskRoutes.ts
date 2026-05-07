import express from 'express';
import { 
  getTasks, 
  getTask, 
  createTask, 
  updateTask, 
  deleteTask 
} from '../controllers/taskController.ts';
import { protect, authorize } from '../middleware/auth.ts';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getTasks)
  .post(authorize('admin'), createTask);

router.route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(authorize('admin'), deleteTask);

export default router;
