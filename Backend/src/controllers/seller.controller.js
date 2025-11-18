import { cookiesOptions } from "../config/cookiesConfig.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { Seller } from "../models/seller.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

export const registerSeller = asyncHandler(async (req, res) => {
  const { storeName, email, password, phoneNumber, address } = req.body;

  const existingSeller = await Seller.findOne({ email });

  if (existingSeller) {
    throw new ApiError(400, "Seller with this email already exists");
  }

  const seller = await Seller.create({
    storeName,
    email,
    password,
    phoneNumber,
    address,
  });

  //   Generate Tokens
  const sellerAccessToken = seller.generateAccessToken();
  const sellerRefreshToken = seller.generateRefreshToken();

  seller.refreshToken = sellerRefreshToken;
  await seller.save({ validateBeforeSave: false });

  const registeredSeller = seller.toObject();
  delete registeredSeller.password;
  delete registeredSeller.refreshToken;

  return res
    .status(201)
    .cookie("sellerRefreshToken", sellerRefreshToken, cookiesOptions)
    .cookie("sellerAccessToken", sellerAccessToken, cookiesOptions)
    .json(
      new ApiResponse(201, registeredSeller, "Seller registered successfully")
    );
});

export const loginSeller = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const seller = await Seller.findOne({ email });

  if (!seller) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isPasswordValid = await seller.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  //   Generate Tokens
  const sellerAccessToken = seller.generateAccessToken();
  const sellerRefreshToken = seller.generateRefreshToken();

  seller.refreshToken = sellerRefreshToken;
  await seller.save({ validateBeforeSave: false });

  const loggedInSeller = seller.toObject();
  delete loggedInSeller.password;
  delete loggedInSeller.refreshToken;

  return res
    .status(200)
    .cookie("sellerRefreshToken", sellerRefreshToken, cookiesOptions)
    .cookie("sellerAccessToken", sellerAccessToken, cookiesOptions)
    .json(
      new ApiResponse(
        200,
        {
          sellerAccessToken,
          sellerRefreshToken,
          seller: loggedInSeller,
        },
        "Login successful"
      )
    );
});

export const logoutSeller = asyncHandler(async (req, res) => {
  if (!req.seller?._id) {
    throw new ApiError(401, "Seller not authenticated");
  }

  await Seller.findByIdAndUpdate(
    req.seller._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .clearCookie("sellerAccessToken", cookiesOptions)
    .clearCookie("sellerRefreshToken", cookiesOptions)
    .json(new ApiResponse(200, {}, "logout Successfully"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.sellerRefreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh Token is missing");
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const seller = await Seller.findById(decodedToken._id);

    if (!seller || seller.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "Invalid Refresh Token");
    }

    const newAccessToken = seller.generateAccessToken();

    return res
      .status(200)
      .cookie("sellerAccessToken", newAccessToken, cookiesOptions)
      .json(
        new ApiResponse(
          200,
          {
            sellerAccessToken: newAccessToken,
          },
          "Access Token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, "Invalid or expired Refresh Token");
  }
});

export const updateSellerStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, isVerified } = req.body;
  const updateData = {};
  if (status) {
    updateData.status = status;
  }
  if (isVerified === true || isVerified === false) {
    updateData.isVerified = isVerified;
  }

  if (Object.keys(updateData).length === 0) {
    throw new ApiError(
      400,
      "At least one field (status or isVerified) is required to update status"
    );
  }

  const seller = await Seller.findByIdAndUpdate(
    id,
    {
      $set: updateData,
    },
    {
      new: true,
      runValidators: true,
    }
  ).select("-password -refreshToken");
  if (!seller) {
    throw new ApiError(404, "Seller not found to update status");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, seller, "Seller status updated successfully"));
});

export const updateStoreImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, " Store Image is required");
  }
  // const path = req.file.path;
  const buffer = req.file.buffer;
  const originalname = req.file.originalname;

  const oldImageUrl = req.seller?.storeImage;

  // const storeImageUrl = await uploadToCloudinary(path);
  const storeImageUrl = await uploadToCloudinary(buffer, originalname);
  if (!storeImageUrl) {
    throw new ApiError(500, "Store Image upload failed");
  }

  const updatedSeller = await Seller.findByIdAndUpdate(
    req.seller?._id,
    {
      $set: {
        storeImage: storeImageUrl,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  ).select("-password -refreshToken");

  if (!updatedSeller) throw new ApiError(404, "Store Image is not updated yet");

  if (
    oldImageUrl !==
      "https://ik.imagekit.io/kmqpfzfho/shop.png?updatedAt=1761891900082" &&
    storeImageUrl
  ) {
    await deleteFromCloudinary(oldImageUrl);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedSeller, "Store Image updated successfully")
    );
});

export const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const seller = await Seller.findById(req.seller._id);

  const isPasswordValid = await seller.isPasswordCorrect(oldPassword);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }
  seller.password = newPassword;
  await seller.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

export const allSellers = asyncHandler(async (req, res) => {
  const sellers = await Seller.find({}).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, sellers, "Sellers retrieved successfully"));
});

export const singleSeller = asyncHandler(async (req, res) => {
  const seller = await Seller.findById(req.params.id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, seller, "Seller retrieved successfully"));
});

export const loggedInSellerInfo = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        req.seller,
        "Seller information retrieved successfully"
      )
    );
});

export const loggedInUpdateSellerInfo = asyncHandler(async (req, res) => {
  const sellerUpdateData = {};
  if (req.body?.storeName) {
    sellerUpdateData.storeName = req.body?.storeName;
  }
  if (req.body?.phoneNumber) {
    sellerUpdateData.phoneNumber = req.body?.phoneNumber;
  }
  if (req.body?.address) {
    sellerUpdateData.address = req.body?.address;
  }

  const seller = await Seller.findByIdAndUpdate(
    req.seller._id,
    {
      $set: sellerUpdateData,
    },
    {
      new: true,
      runValidators: true,
    }
  ).select("-password -refreshToken");

  if (!seller) {
    throw new ApiError(404, "Seller not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, seller, "Seller information updated successfully")
    );
});

export const productList = asyncHandler(async (req, res) => {
  const products = await Product.find({ seller: req.seller?._id }).populate(
    "category",
    "name"
  );
  return res
    .status(200)
    .json(new ApiResponse(200, products, "Seller products are fetched"));
});

export const orderList = asyncHandler(async (req, res) => {
  const orders = await Order.find({ "items.seller": req.seller?._id })
    .populate("items.product", "name images price offerPrice")
    .sort({
      createdAt: -1,
    });
  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Seller Orders are fetched"));
});
