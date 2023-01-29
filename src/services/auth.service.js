import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export function generateAccessToken(userId) {
  return jwt.sign(userId, process.env.TOKEN_SECRET, { expiresIn: '240m' });
}

export function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

export function comparePassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}