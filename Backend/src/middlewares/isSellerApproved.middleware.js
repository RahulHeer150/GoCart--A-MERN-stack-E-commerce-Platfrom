import ApiError from "../utils/ApiError.js";

export const isSellerApproved = (req, res, next) => {
  if (req.seller.status !== "Approved") {
    throw new ApiError(
      403,
      "Forbidden:Your account is not approved to perform this action"
    );
  }
  next();
};
