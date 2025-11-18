import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import {
  validateAddress,
  validateUpdateAddress,
} from "../middlewares/validation.middleware.js";
import {
  addAddress,
  deleteAddress,
  getAllAddresses,
  getsingleAddress,
  updateAddress,
} from "../controllers/address.controller.js";

const router = express.Router();

router
  .route("/")
  .post(authenticateUser, validateAddress, addAddress)
  .get(authenticateUser, getAllAddresses);

router
  .route("/:addressId")
  .get(authenticateUser, getsingleAddress)
  .patch(authenticateUser, validateUpdateAddress, updateAddress)
  .delete(authenticateUser, deleteAddress);

export default router;
