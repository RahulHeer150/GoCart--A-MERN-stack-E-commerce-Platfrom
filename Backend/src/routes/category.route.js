import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
} from "../controllers/category.controller.js";
import { authenticateAdmin } from "../middlewares/auth.middleware.js";
import {
  validateCategory,
  validateCategoryUpdate,
} from "../middlewares/validation.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router
  .route("/")
  .get(getAllCategories)
  .post(
    authenticateAdmin,
    upload.single("image"),
    validateCategory,
    createCategory
  );
router
  .route("/:categoryId")
  .get(getSingleCategory)
  .patch(
    authenticateAdmin,
    upload.single("image"),
    validateCategoryUpdate,
    updateCategory
  )
  .delete(authenticateAdmin, deleteCategory);

export default router;
