import express from 'express';
import { 
  getProjects, 
  getProject, 
  createProject, 
  updateProject, 
  deleteProject 
} from '../controllers/projectController.ts';
import { protect, authorize } from '../middleware/auth.ts';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getProjects)
  .post(authorize('admin'), createProject);

router.route('/:id')
  .get(getProject)
  .put(authorize('admin'), updateProject)
  .delete(authorize('admin'), deleteProject);

export default router;
