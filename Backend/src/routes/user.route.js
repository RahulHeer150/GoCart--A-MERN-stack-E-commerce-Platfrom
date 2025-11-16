import express from "express";
import {
  changePassword,
  loggedInUpdateUserInfo,
  loggedInUserInfo,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAvatar,
} from "../controllers/user.controller.js";
import {
  validateChangePassword,
  validateLogin,
  validateRegistration,
  validateUserUpdate,
} from "../middlewares/validation.middleware.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.route("/register").post(validateRegistration, registerUser);
router.route("/login").post(validateLogin, loginUser);
router.route("/logout").post(authenticateUser, logoutUser);
router.route("/refresh-token").get(refreshAccessToken);
router.route("/me").get(authenticateUser, loggedInUserInfo);

router
  .route("/me/details")
  .patch(authenticateUser, validateUserUpdate, loggedInUpdateUserInfo);
router
  .route("/me/avatar")
  .patch(authenticateUser, upload.single("avatar"), updateAvatar);

router
  .route("/me/change-password")
  .patch(authenticateUser, validateChangePassword, changePassword);

export default router;
