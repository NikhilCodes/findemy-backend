import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { addCartItem, emptyCartItems, getCartItems, removeCartItem } from "../services/cart.service.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  const resp = await addCartItem(req.user.sub, req.body.productId)
  res.json(resp);
})

router.get("/", authMiddleware, async (req, res) => {
  const carts = await  getCartItems(req.user.sub);
  res.json(carts);
})

router.delete("/:id", authMiddleware, async (req, res) => {
  const resp = await removeCartItem(req.user.sub, req.params.id);
  res.json(resp);
})

export default router;