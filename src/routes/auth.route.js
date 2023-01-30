import express from 'express';
import { findUserByEmail, saveUser } from '../services/user.service.js';
import { comparePassword, generateAccessToken, hashPassword } from "../services/auth.service.js";
import bcrypt from "bcrypt";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { findUserById } from '../services/user.service'

const router = express.Router();

router.get('/me', authMiddleware, async (req, res) => {
  const userId = req.user.sub;
  const user = await findUserById(userId);
  if (user) {
    res.send({
      _id: user._id,
      email: user.email,
      name: user.name,
    });
  } else {
    res.status(404).send({ success: false, reason: 'User not found' });
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(404).send({ success: false, reason: 'User not found' });
  }
  if (!comparePassword(password, user.password)) {
    return res.status(401).send({ success: false, reason: 'Password incorrect' });
  }
  res.status(200).json({
    success: true,
    jwt: generateAccessToken({ sub: user._id }),
  });
})

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const passwordHashed = hashPassword(password);
  const user = await saveUser({ name, email, password: passwordHashed });
  res.send({
    success: true,
  });
})

export default router;