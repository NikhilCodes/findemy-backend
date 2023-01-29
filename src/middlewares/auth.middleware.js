import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token is required' });
  }
  try {
    req.user = jwt.verify(token, process.env.TOKEN_SECRET);
  } catch (err) {
    return res.status(401).json({ message: 'Invalid Token' });
  }
  return next();
}