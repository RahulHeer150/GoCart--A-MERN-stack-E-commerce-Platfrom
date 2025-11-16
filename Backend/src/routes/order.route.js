import express from "express";
import {
  authenticateAdmin,
  authenticateSeller,
  authenticateUser,
} from "../middlewares/auth.middleware.js";
import {
  addOrder,
  getAllOrders,
  getAllOrdersOfUser,
  getSellerOrders,
  getSingleOrderOfUser,
  UpdateOrderStatus,
  updateProductOrderStatus,
} from "../controllers/order.controller.js";
import { isSellerApproved } from "../middlewares/isSellerApproved.middleware.js";

const router = express.Router();

router
  .route("/")
  .post(authenticateUser, addOrder)
  .get(authenticateUser, getAllOrdersOfUser);

router
  .route("/seller")
  .get(authenticateSeller, isSellerApproved, getSellerOrders);

router.route("/admin").get(authenticateAdmin, getAllOrders);

router
  .route("/:orderId")
  .get(authenticateUser, getSingleOrderOfUser)
  .patch(authenticateAdmin, UpdateOrderStatus);

router
  .route("/:orderId/item/:productId")
  .patch(authenticateSeller, isSellerApproved, updateProductOrderStatus);

export default router;
