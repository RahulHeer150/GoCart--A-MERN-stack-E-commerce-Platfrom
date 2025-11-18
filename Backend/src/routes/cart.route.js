import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import {
  addItemToCart,
  clearCart,
  getCartItems,
  removeItemFromCart,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.use(authenticateUser);

router.route("/").post(addItemToCart).get(getCartItems).delete(clearCart);

router.route("/:productId").delete(removeItemFromCart);

export default router;
