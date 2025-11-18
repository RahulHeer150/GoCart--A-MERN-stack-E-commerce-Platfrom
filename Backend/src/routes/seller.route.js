import express from "express";
import {
  allSellers,
  changePassword,
  loggedInSellerInfo,
  loggedInUpdateSellerInfo,
  loginSeller,
  logoutSeller,
  orderList,
  productList,
  refreshAccessToken,
  registerSeller,
  singleSeller,
  updateSellerStatus,
  updateStoreImage,
} from "../controllers/seller.controller.js";
import {
  validateChangePassword,
  validateLogin,
  validateSellerRegistration,
  validateSellerUpdate,
} from "../middlewares/validation.middleware.js";
import {
  authenticateAdmin,
  authenticateSeller,
} from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.route("/register").post(validateSellerRegistration, registerSeller);

router.route("/login").post(validateLogin, loginSeller);

router.route("/logout").post(authenticateSeller, logoutSeller);

router.route("/refresh-token").get(refreshAccessToken);

router.route("/").get(allSellers);

router.route("/:id/status").patch(authenticateAdmin, updateSellerStatus);

router.route("/me").get(authenticateSeller, loggedInSellerInfo);

router
  .route("/me/details")
  .patch(authenticateSeller, validateSellerUpdate, loggedInUpdateSellerInfo);

router
  .route("/me/storeImage")
  .patch(authenticateSeller, upload.single("storeImage"), updateStoreImage);

router
  .route("/me/change-password")
  .patch(authenticateSeller, validateChangePassword, changePassword);

router.route("/me/products").get(authenticateSeller, productList);

router.route("/me/orders").get(authenticateSeller, orderList);

router.route("/:id").get(singleSeller);

export default router;
