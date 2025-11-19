import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../utils/cloudinary.js";
import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";

export const createCategory = asyncHandler(async (req, res) => {
  const { name, path, color } = req.body;

  if (!req.file) {
    throw new ApiError(400, "Image is required");
  }

  // const imagePath = req.file.path;
  const buffer = req.file.buffer;
  const originalname = req.file.originalname;

  // const imageUrl = await uploadToCloudinary(imagePath);
  const imageUrl = await uploadToCloudinary(buffer, originalname);

  if (!imageUrl) {
    throw new ApiError(500, "Image upload failed");
  }

  const category = await Category.create({
    name,
    path,
    color,
    image: imageUrl,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, category, "Category created successfully"));
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const updateData = {};
  if (req.body?.name) updateData.name = req.body?.name;
  if (req.body?.path) updateData.path = req.body?.path;
  if (req.body?.color) updateData.color = req.body?.color;

  const category = await Category.findById(categoryId);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  if (req.file) {
    // const newImagePath = req.file.path;

    const buffer = req.file.buffer;
    const originalname = req.file.originalname;

    // const newImageUrl = await uploadToCloudinary(newImagePath);
    const newImageUrl = await uploadToCloudinary(buffer, originalname);
    updateData.image = newImageUrl;
  }

  const updateCategory = await Category.findByIdAndUpdate(
    categoryId,
    {
      $set: updateData,
    },
    { new: true, runValidators: true }
  );

  if (req.file && category.image) {
    await deleteFromCloudinary(category.image);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updateCategory, "Category updated successfully")
    );
});

export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});

  return res
    .status(200)
    .json(
      new ApiResponse(200, categories, "Categories retrieved successfully")
    );
});

export const getSingleCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.categoryId);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category retrieved successfully"));
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const productInCategory = await Product.findOne({ category: categoryId });
  if (productInCategory) {
    throw new ApiError(
      400,
      "Cannot delete category. Products are still associated with it."
    );
  }

  const category = await Category.findByIdAndDelete(categoryId);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  if (category.image) await deleteFromCloudinary(category.image);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Category deleted successfully"));
});
