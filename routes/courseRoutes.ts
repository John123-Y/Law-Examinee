import express from 'express';
import { createCourse, getCourses, getCourse, updateCourse, deleteCourse } from '../controllers/courseController';
import { protect, restrictToAdmin } from '../middleware/authMiddleware';
import upload from '../middleware/uploadMiddleware';

const router = express.Router();

router.route('/')
  .get(getCourses)
  .post(protect, restrictToAdmin, upload.single('image'), createCourse);

router.route('/:id')
  .get(getCourse)
  .patch(protect, restrictToAdmin, upload.single('image'), updateCourse)
  .delete(protect, restrictToAdmin, deleteCourse);

export default router;