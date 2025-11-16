import express from "express";
import {
  adminAuth,
  loginAdmin,
  logoutAdmin,
} from "../controllers/admin.controller.js";
import { authenticateAdmin } from "../middlewares/auth.middleware.js";
import { validateLogin } from "../middlewares/validation.middleware.js";

const router = express.Router();

router.route("/login").post(validateLogin, loginAdmin);

router.route("/logout").post(authenticateAdmin, logoutAdmin);

router.route("/auth").get(authenticateAdmin, adminAuth);

export default router;
