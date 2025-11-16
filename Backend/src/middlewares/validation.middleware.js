import {
  addressSchema,
  categorySchema,
  categoryUpdateSchema,
  changePasswordSchema,
  loginSchema,
  productSchema,
  registerSchema,
  sellerRegisterSchema,
  sellerUpdateSchema,
  updateAddressSchema,
  updateProductSchema,
  userUpdateSchema,
} from "../config/joiSchema.js";
import ApiError from "../utils/ApiError.js";

export const validateRegistration = async (req, res, next) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    throw new ApiError(
      400,
      `Validation Error: ${error.details
        .map((detail) => detail.message)
        .join(", ")}`
    );
  }
  next();
};

export const validateLogin = async (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    throw new ApiError(
      400,
      `Validation Error: ${error.details
        .map((detail) => detail.message)
        .join(", ")}`
    );
  }
  next();
};

export const validateUserUpdate = async (req, res, next) => {
  const { error } = userUpdateSchema.validate(req.body);
  if (error) {
    throw new ApiError(
      400,
      `Validation Error: ${error.details
        .map((detail) => detail.message)
        .join(", ")}`
    );
  }
  next();
};

export const validateChangePassword = async (req, res, next) => {
  const { error } = changePasswordSchema.validate(req.body);
  if (error) {
    throw new ApiError(
      400,
      `Validation Error: ${error.details
        .map((detail) => detail.message)
        .join(", ")}`
    );
  }
  next();
};

export const validateSellerRegistration = async (req, res, next) => {
  const { error } = sellerRegisterSchema.validate(req.body);
  if (error) {
    throw new ApiError(
      400,
      `Validation Error: ${error.details
        .map((detail) => detail.message)
        .join(", ")}`
    );
  }
  next();
};

export const validateSellerUpdate = async (req, res, next) => {
  const { error } = sellerUpdateSchema.validate(req.body);
  if (error) {
    throw new ApiError(
      400,
      `Validation Error: ${error.details
        .map((detail) => detail.message)
        .join(", ")}`
    );
  }
  next();
};

export const validateCategory = async (req, res, next) => {
  const { error } = categorySchema.validate(req.body);
  console.log(error);
  if (error) {
    throw new ApiError(
      400,
      `Validation Error: ${error.details
        .map((detail) => detail.message)
        .join(", ")}`
    );
  }
  next();
};

export const validateCategoryUpdate = async (req, res, next) => {
  const { error } = categoryUpdateSchema.validate(req.body);
  if (error) {
    throw new ApiError(
      400,
      `Validation Error: ${error.details
        .map((detail) => detail.message)
        .join(", ")}`
    );
  }
  next();
};

export const validateProduct = async (req, res, next) => {
  const { error } = productSchema.validate(req.body);
  if (error) {
    throw new ApiError(
      400,
      `Validation Error: ${error.details
        .map((detail) => detail.message)
        .join(", ")}`
    );
  }
  next();
};

export const validateUpdateProduct = async (req, res, next) => {
  const { error } = updateProductSchema.validate(req.body);
  if (error) {
    throw new ApiError(
      400,
      `Validation Error: ${error.details
        .map((detail) => detail.message)
        .join(", ")}`
    );
  }
  next();
};

export const validateAddress = async (req, res, next) => {
  const { error } = addressSchema.validate(req.body);
  if (error) {
    throw new ApiError(
      400,
      `Validation Error: ${error.details
        .map((detail) => detail.message)
        .join(", ")}`
    );
  }
  next();
};

export const validateUpdateAddress = async (req, res, next) => {
  const { error } = updateAddressSchema.validate(req.body);
  if (error) {
    throw new ApiError(
      400,
      `Validation Error: ${error.details
        .map((detail) => detail.message)
        .join(", ")}`
    );
  }
  next();
};
