import express from 'express';
import {
  enrollCourse,
  findCoursesById,
  findCoursesByStudentViewing,
  findCoursesByTitleSubstringAndLevels
} from "../services/course.service.js";
import { authMiddleware, authMiddlewareLax } from "../middlewares/auth.middleware.js";
import { emptyCartItems } from "../services/cart.service.js";

const router = express.Router();

router.get('/search', authMiddlewareLax, async (req, res) => {
  let { keyword, levels, page, size } = req.query;
  levels = levels ? levels.split(',') : ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];
  const courses = await findCoursesByTitleSubstringAndLevels(keyword, levels, req.user?.sub, +size, +page);
  res.json(courses);
});

router.get('/popular', async (req, res) => {
  const courses = await findCoursesByStudentViewing();
  res.json(courses);
});

router.get('/:id', authMiddlewareLax, async (req, res) => {
  const course = await findCoursesById(req.params.id, req.user?.sub);
  res.json(course);
});

router.post('/enroll', authMiddleware, async (req, res) => {
  const enrolls = await Promise.all(req.body.courseIds.map(async (courseId) => {
    return await enrollCourse(courseId, req.user.sub);
  }))
  await emptyCartItems(req.user.sub);
  res.json(enrolls);
})

export default router;