import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../utils/cloudinary.js";
import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";

export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    offerPrice,
    weight,
    unit,
    stockQuantity,
    category,
  } = req.body;

  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "Images are required");
  }

  // const images = [];
  // for (let image of req.files) {
  //   const result = await uploadToCloudinary(image.path);
  //   images.push(result);
  // }

  const images = [];
  for (const file of req.files) {
    const result = await uploadToCloudinary(file.buffer, file.originalname);
    images.push(result);
  }

  if (images.length === 0) {
    throw new ApiError(500, "Image upload failed");
  }

  const categoryObject = await Category.findOne({ name: category });

  if (!categoryObject) {
    throw new ApiError(404, "Category not found");
  }

  const product = await Product.create({
    name,
    description,
    images,
    price,
    offerPrice,
    weight,
    unit,
    stockQuantity,
    category: categoryObject._id,
    seller: req.seller._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully"));
});

export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({})
    .populate("category", "name path")
    .populate("seller", "storeName");

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products retrieved successfully"));
});

export const getSingleProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId)
    .populate("category", "name path")
    .populate("seller", "storeName");

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product retrieved successfully"));
});

export const updateProductDetails = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const {
    name,
    description,
    price,
    offerPrice,
    weight,
    unit,
    stockQuantity,
    category,
  } = req.body;

  const updateData = {};

  if (name) {
    updateData.name = name;
  }
  if (description) {
    updateData.description = description;
  }
  if ("price" in req.body) {
    updateData.price = price;
  }
  if ("offerPrice" in req.body) {
    updateData.offerPrice = offerPrice;
  }
  if ("weight" in req.body) {
    updateData.weight = weight;
  }
  if (unit) {
    updateData.unit = unit;
  }
  if ("stockQuantity" in req.body) {
    updateData.stockQuantity = stockQuantity;
  }

  if (category) {
    const categoryObject = await Category.findOne({ name: category });
    if (!categoryObject) {
      throw new ApiError(404, "Category not found");
    }
    updateData.category = categoryObject._id;
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (product.seller.toString() !== req.seller._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this product");
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    {
      $set: updateData,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedProduct) {
    throw new ApiError(404, "Product is not updated yet");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedProduct,
        "Product details updated successfully"
      )
    );
});

export const updateProductImages = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "Images are required");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "No such product found");
  }

  if (product.seller.toString() !== req.seller._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this product");
  }

  // const images = [];
  // for (const image of req.files) {
  //   const result = await uploadToCloudinary(image.path);
  //   images.push(result);
  // }

  const images = [];
  for (const file of req.files) {
    const result = await uploadToCloudinary(file.buffer, file.originalname);
    images.push(result);
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    {
      $set: {
        images,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (req.files && product.images) {
    for (const imageurl of product.images) {
      await deleteFromCloudinary(imageurl);
    }
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedProduct,
        "Product images updated successfully"
      )
    );
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findOneAndDelete({
    _id: productId,
    seller: req.seller._id,
  });

  if (!product) {
    throw new ApiError(404, "Product not found or you are not authorized");
  }

  if (product.images) {
    for (const imageUrl of product.images) {
      await deleteFromCloudinary(imageUrl);
    }
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Product deleted successfully"));
});
