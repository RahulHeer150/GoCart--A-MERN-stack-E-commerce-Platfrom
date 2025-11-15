import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { cookiesOptions } from "../config/cookiesConfig.js";
import bcrypt from "bcrypt";

export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (email !== process.env.ADMIN_EMAIL) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    process.env.ADMIN_PASSWORD_HASH
  );

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  try {
    const adminToken = jwt.sign(
      {
        email: process.env.ADMIN_EMAIL,
        role: "admin",
      },
      process.env.ADMIN_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res
      .status(200)
      .cookie("adminToken", adminToken, cookiesOptions)
      .json(new ApiResponse(200, { adminToken }, "Login successful"));
  } catch (error) {
    throw new ApiError(500, error.message || "Internal Server Error");
  }
});

export const logoutAdmin = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .clearCookie("adminToken", cookiesOptions)
    .json(new ApiResponse(200, {}, "Logout successfull"));
});

export const adminAuth = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        email: req.admin.email,
        role: req.admin.role,
      },
      "Admin authenticated"
    )
  );
});
