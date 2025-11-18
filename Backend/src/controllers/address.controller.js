import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { Address } from "../models/address.model.js";

export const addAddress = asyncHandler(async (req, res) => {
  const {
    recipientName,
    recipientPhone,
    street,
    city,
    state,
    zipCode,
    country,
    addressType,
    isDefault,
  } = req.body;

  if (isDefault === true) {
    await Address.updateMany(
      { user: req.user._id },
      { $set: { isDefault: false } }
    );
  }

  const address = await Address.create({
    user: req.user._id,
    recipientName,
    recipientPhone,
    street,
    city,
    state,
    zipCode,
    country,
    addressType,
    isDefault,
  });

  if (!address) {
    throw new ApiError(500, "Address not created");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, address, "Address created successfully"));
});

export const getAllAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.user._id }).sort({
    isDefault: -1,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, addresses, "Addresses retrieved successfully"));
});

export const getsingleAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;

  const address = await Address.findOne({ _id: addressId, user: req.user._id });

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, address, "Address retrieved successfully"));
});

export const updateAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const updateData = req.body;

  if (updateData.isDefault === true) {
    await Address.updateMany(
      { user: req.user._id, _id: { $ne: addressId } },
      { $set: { isDefault: false } }
    );
  }

  const address = await Address.findById(addressId);

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  if (req.user._id.toString() !== address.user.toString()) {
    throw new ApiError(403, "You are not authorized to update this address");
  }

  const updatedAddress = await Address.findByIdAndUpdate(
    addressId,
    {
      $set: updateData,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedAddress) {
    throw new ApiError(500, "Address not updated yet");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedAddress, "Address updated successfully"));
});

export const deleteAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;

  const address = await Address.findOneAndDelete({
    _id: addressId,
    user: req.user._id,
  });
  if (!address) {
    throw new ApiError(404, "Address not found or you are not authorized");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Address deleted successfully"));
});
