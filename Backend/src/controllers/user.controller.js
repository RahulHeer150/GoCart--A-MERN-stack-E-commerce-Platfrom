import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import ApiResponse from "../utils/ApiResponse.js";
import { cookiesOptions } from "../config/cookiesConfig.js";
import ApiError from "../utils/ApiError.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../utils/cloudinary.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, password, email, phoneNumber } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(400, "User with this email already exists");
  }

  const newUser = await User.create({
    name,
    password,
    email,
    phoneNumber,
  });

  //   Generate Tokens
  const accessToken = newUser.generateAccessToken();
  const refreshToken = newUser.generateRefreshToken();

  newUser.refreshToken = refreshToken;
  await newUser.save({ validateBeforeSave: false });

  const user = newUser.toObject();
  delete user.password;
  delete user.refreshToken;

  return res
    .status(201)
    .cookie("refreshToken", refreshToken, cookiesOptions)
    .cookie("accessToken", accessToken, cookiesOptions)
    .json(
      new ApiResponse(
        201,
        {
          user,
        },
        "User registered successfully"
      )
    );
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  //   Generate Tokens
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const loggedInUser = user.toObject();
  delete loggedInUser.password;
  delete loggedInUser.refreshToken;

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, cookiesOptions)
    .cookie("accessToken", accessToken, cookiesOptions)
    .json(
      new ApiResponse(
        200,
        {
          accessToken,
          refreshToken,
          user: loggedInUser,
        },
        "Login successful"
      )
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new ApiError(401, "User not authenticated");
  }

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .clearCookie("accessToken", cookiesOptions)
    .clearCookie("refreshToken", cookiesOptions)
    .json(new ApiResponse(200, {}, "logout Successfully"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh Token is missing");
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.JWT_KEY
    );

    const user = await User.findById(decodedToken._id);

    if (!user || user.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "Invalid Refresh Token");
    }

    const newAccessToken = user.generateAccessToken();

    return res
      .status(200)
      .cookie("accessToken", newAccessToken, cookiesOptions)
      .json(
        new ApiResponse(
          200,
          { accessToken: newAccessToken },
          "Access Token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, "Invalid or expired Refresh Token");
  }
});

export const loggedInUserInfo = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse(200, req.user, "User information retrieved successfully")
    );
});

export const loggedInUpdateUserInfo = asyncHandler(async (req, res) => {
  const updateData = {};
  if (req.body?.name) updateData.name = req.body?.name;
  if (req.body?.email) updateData.email = req.body?.email;
  if (req.body?.phoneNumber) updateData.phoneNumber = req.body?.phoneNumber;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: updateData,
    },
    {
      new: true,
      runValidators: true,
    }
  ).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User information updated successfully"));
});

export const updateAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Avatar is required");
  }
  // const path = req.file.path;
  const buffer = req.file.buffer;
  const originalname = req.file.originalname;

  const oldAvatar = req.user.avatar;

  // const avatarUrl = await uploadToCloudinary(path);
  const avatarUrl = await uploadToCloudinary(buffer, originalname);

  if (!avatarUrl) {
    throw new ApiError(500, "Avatar upload failed");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { avatar: avatarUrl } },
    { new: true, runValidators: true }
  ).select("-password -refreshToken");

  if (!updatedUser) throw new ApiError(500, "Avatar is not updated yet");

  if (oldAvatar !== "https://avatar.iran.liara.run/public" && avatarUrl) {
    await deleteFromCloudinary(oldAvatar);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Avatar updated successfully"));
});

export const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);

  const isPasswordValid = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  user.password = newPassword;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});
