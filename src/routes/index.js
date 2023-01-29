import express from 'express';
import authRoute from "./auth.route.js";
import courseRoute from "./course.route.js";
import cartRoute from "./cart.route.js";
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello World!');
})

router.use('/auth', authRoute);
router.use('/courses', courseRoute);
router.use('/cart', cartRoute);

export default router;