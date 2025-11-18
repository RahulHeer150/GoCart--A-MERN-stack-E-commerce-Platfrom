import express from "express";
import { authenticateSeller } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  validateProduct,
  validateUpdateProduct,
} from "../middlewares/validation.middleware.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProductDetails,
  updateProductImages,
} from "../controllers/product.controller.js";
import { isSellerApproved } from "../middlewares/isSellerApproved.middleware.js";

const router = express.Router();

router
  .route("/")
  .post(
    authenticateSeller,
    isSellerApproved,
    upload.array("images", 4),
    validateProduct,
    createProduct
  )
  .get(getAllProducts);

router
  .route("/:productId")
  .get(getSingleProduct)
  .delete(authenticateSeller, isSellerApproved, deleteProduct);

router
  .route("/:productId/details")
  .patch(
    authenticateSeller,
    isSellerApproved,
    validateUpdateProduct,
    updateProductDetails
  );

router
  .route("/:productId/images")
  .patch(
    authenticateSeller,
    isSellerApproved,
    upload.array("images", 4),
    updateProductImages
  );

export default router;
