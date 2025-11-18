import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { Cart } from "../models/cart.model.js";

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
    await cart.save();
  }
  return cart;
};

export const addItemToCart = asyncHandler(async (req, res) => {
  const { productId, quantity, seller } = req.body;

  if (!productId || !quantity || !seller) {
    throw new ApiError(400, "Product ID, quantity, and seller are required");
  }

  const cart = await getOrCreateCart(req.user._id);

  const existingItemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId.toString()
  );

  if (existingItemIndex !== -1) {
    // Item already exists in cart, update quantity
    cart.items[existingItemIndex].quantity = quantity;
  } else {
    // Item doesn't exist in cart, add new item
    cart.items.push({ product: productId, quantity, seller });
  }

  await cart.save();
  const populatedCart = await cart.populate([
    {
      path: "items.product",
      select:
        "name description price offerPrice images stockQuantity weight unit category",
      populate: {
        path: "category",
        select: "name",
      },
    },
    {
      path: "items.seller",
      select: "storeName",
    },
  ]);

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        populatedCart.items,
        "Item added to cart successfully"
      )
    );
});

export const getCartItems = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id })
    .populate({
      path: "items.product",
      select:
        "name description price offerPrice images stockQuantity category weight unit",
      populate: {
        path: "category",
        select: "name",
      },
    })
    .populate({ path: "items.seller", select: "storeName" });

  return res
    .status(200)
    .json(
      new ApiResponse(200, cart.items, "Cart items retrieved successfully")
    );
});

export const removeItemFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    throw new ApiError(404, "Cart not found for the user");
  }
  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId.toString()
  );
  if (itemIndex === -1) {
    throw new ApiError(404, "Item not found in cart");
  }
  cart.items.splice(itemIndex, 1);
  await cart.save();

  const populatedCart = await cart.populate([
    {
      path: "items.product",
      select:
        "name description price offerPrice images stockQuantity weight unit category",
      populate: {
        path: "category",
        select: "name",
      },
    },
    { path: "items.seller", select: "storeName" },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        populatedCart.items,
        "Item removed from cart successfully"
      )
    );
});

export const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Cart cleared successfully"));
  }
  cart.items = [];
  await cart.save();
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Cart cleared successfully"));
});
