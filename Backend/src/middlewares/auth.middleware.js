import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { Seller } from "../models/seller.model.js";

export const authenticateUser = async (req, res, next) => {
  const accessToken =
    req.cookies?.accessToken ||
    req.headers.authorization?.replace("Bearer ", "");

  if (!accessToken) {
    throw new ApiError(401, "Access Token is missing or expired");
  }
  try {
    const decodedToken = jwt.verify(
      accessToken,
      process.env.JWT_KEY
    );

    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ApiError(401, "User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error.message || "Invalid or expired Access Token");
  }
};

export const authenticateSeller = async (req, res, next) => {
  const accessToken =
    req.cookies.sellerAccessToken ||
    req.headers.authorization?.replace("Bearer ", "");

  if (!accessToken) {
    throw new ApiError(401, "Access Token is missing or expired");
  }
  try {
    const decodedToken = jwt.verify(
      accessToken,
      process.env.JWT_KEY
    );

    const seller = await Seller.findById(decodedToken._id).select(
      "-password -refreshToken"
    );
    if (!seller) {
      throw new ApiError(401, "Seller not found");
    }
    req.seller = seller;
    next();
  } catch (error) {
    throw new ApiError(401, error.message || "Invalid or expired Access Token");
  }
};

export const authenticateAdmin = async (req, res, next) => {
  const adminToken =
    req.cookies.adminToken || req.headers.authorization?.replace("Bearer ", "");

  if (!adminToken) {
    throw new ApiError(401, " Token is missing or expired");
  }
  try {
    const decodedToken = jwt.verify(adminToken, process.env.JWT_KEY);

    if (decodedToken.role !== "admin") {
      throw new ApiError(403, "Forbidden: You are not an admin");
    }
    req.admin = decodedToken;
    next();
  } catch (error) {
    throw new ApiError(401, error.message || "Invalid or expired Access Token");
  }
};
