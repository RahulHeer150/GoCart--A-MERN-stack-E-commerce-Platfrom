/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { RxCrossCircled } from "react-icons/rx";
import { AppContext } from "../context/AppContext";
import { useDispatch, useSelector } from "react-redux";
import {
  addAndUpdateCart,
  clearCart,
  removeFromCart,
  selectCartCount,
  selectCartItems,
  selectCartTotal,
} from "../features/cart/cartSlice";
import { setShowUserLogin } from "../features/ui/uiSlice";
import userApi from "../api/userApi";

const Cart = () => {
  const { navigate, toast } = useContext(AppContext);

  const cartItems = useSelector(selectCartItems);
  const getCartCount = useSelector(selectCartCount);
  const getCartAmount = useSelector(selectCartTotal);
  const { userData } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [address, setAddress] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentOption, setPaymentOption] = useState("COD");

  const fetchAddresses = async () => {
    try {
      const response = await userApi.get("/addresses");
      if (response.status === 200) {
        setAddress(response.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch addresses");
    }
  };

  useEffect(() => {
    if (address.length > 0) {
      const DefaultAddress = address.find((item) => item.isDefault === true);
      setSelectedAddress(DefaultAddress);
    }
  }, [address]);

  useEffect(() => {
    if (userData) {
      fetchAddresses();
    }
  }, [userData]);

  const placeOrder = async () => {
    setLoading(true);
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      setLoading(false);
      return;
    }
    if (getCartCount === 0) {
      toast.error("Your Cart is empty");
      setLoading(false);
      return;
    }
    if (getCartAmount < 45 && paymentOption === "Online") {
      toast.error(
        "Minimum order amount is ₹45 for Online payment. Increase Amount or select COD"
      );
      setLoading(false);
      return;
    }
    try {
      const response = await userApi.post("/orders", {
        addressId: selectedAddress._id,
        paymentMethod: paymentOption,
      });

      // CAse 1: COD
      if (paymentOption === "COD" && response.status === 201) {
        toast.success("Order placed successfully");
        await dispatch(clearCart());
        navigate("/orders");
        scrollTo(0, 0);
      } else if (paymentOption === "Online" && response.status === 200) {
        await dispatch(clearCart());
        window.location.href = response.data.data.url;
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 mt-16 h-[50vh]">
        <h1 className="text-3xl font-medium">Your Cart is Empty</h1>
        <button
          onClick={() => {
            navigate("/products");
            scrollTo(0, 0);
          }}
          className="group cursor-pointer flex items-center gap-2 text-emerald-600 font-medium"
        >
          <FaArrowLeftLong className="text-base" />
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row mt-16">
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6">
          Shopping Cart{" "}
          <span className="text-sm text-emerald-600">{getCartCount} Items</span>
        </h1>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
          <p className="text-left">Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        <div className="h-[57vh] overflow-auto no-scrollbar">
          {cartItems.map((item) => (
            <div
              key={item.product._id}
              className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3"
            >
              <div className="flex items-center md:gap-6 gap-3">
                <div
                  onClick={() => {
                    navigate(
                      `/products/${item.product.category.name.toLowerCase()}/${
                        item.product._id
                      }`
                    );
                    scrollTo(0, 0);
                  }}
                  className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded overflow-hidden"
                >
                  <img
                    className="max-w-full h-full object-cover"
                    src={item.product.images[0]}
                    alt={item.product.name}
                  />
                </div>
                <div>
                  <p className="hidden md:block font-semibold">
                    {item.product.name}
                  </p>
                  <div className="font-normal text-gray-500/70">
                    <p>
                      Weight:{" "}
                      <span>
                        {item.product.weight || "N/A"}
                        {item.product.unit}
                      </span>
                    </p>
                    <div className="flex items-center">
                      <p>Qty:</p>
                      <select
                        onChange={(e) => {
                          dispatch(
                            addAndUpdateCart({
                              product: item.product,
                              quantity: Number(e.target.value),
                              seller: item.seller._id,
                            })
                          );
                        }}
                        value={item.quantity}
                        className="outline-none"
                      >
                        {Array(Math.min(item.product.stockQuantity, 10))
                          .fill("")
                          .map((_, index) => (
                            <option key={index} value={index + 1}>
                              {index + 1}
                            </option>
                          ))}
                        {item.quantity > 10 && (
                          <option key={item.quantity} value={item.quantity}>
                            {item.quantity}
                          </option>
                        )}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-center">
                ₹
                {(item.product.offerPrice || item.product.price) *
                  item.quantity}
              </p>
              <button
                onClick={() => dispatch(removeFromCart(item.product._id))}
                className="cursor-pointer mx-auto"
              >
                <RxCrossCircled className="text-red-500 text-xl" />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            navigate("/products");
            scrollTo(0, 0);
          }}
          className="group cursor-pointer flex items-center mt-8 gap-2 text-emerald-600 font-medium"
        >
          <FaArrowLeftLong className="text-base" />
          Continue Shopping
        </button>
      </div>

      <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
        <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
        <hr className="border-gray-300 my-5" />

        <div className="mb-6">
          <p className="text-sm font-medium uppercase">Delivery Address</p>
          <div className="relative flex justify-between items-start mt-2">
            <p className="text-gray-500">
              {selectedAddress
                ? `${selectedAddress.street},${selectedAddress.city},${selectedAddress.state},${selectedAddress.country}`
                : "No address found"}
            </p>
            <button
              onClick={() => setShowAddress(!showAddress)}
              className="text-emerald-600 hover:underline cursor-pointer"
            >
              Change
            </button>
            {showAddress && (
              <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full">
                {address.map((address, index) => (
                  <p
                    key={index}
                    onClick={() => {
                      setShowAddress(false);
                      setSelectedAddress(address);
                    }}
                    className="text-gray-500 p-2 hover:bg-gray-100"
                  >
                    {address.street},{address.city},{address.state},
                    {address.country}
                  </p>
                ))}
                <p
                  onClick={() => {
                    navigate("/address");
                    scrollTo(0, 0);
                  }}
                  className="text-emerald-600 text-center cursor-pointer p-2 hover:bg-indigo-500/10"
                >
                  Add address
                </p>
              </div>
            )}
          </div>

          <p className="text-sm font-medium uppercase mt-6">Payment Method</p>

          <select
            onChange={(e) => setPaymentOption(e.target.value)}
            className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none"
          >
            <option value="COD">Cash On Delivery</option>
            <option value="Online">Online Payment</option>
          </select>
        </div>

        <hr className="border-gray-300" />

        <div className="text-gray-500 mt-4 space-y-2">
          <p className="flex justify-between">
            <span>Price</span>
            <span>₹{getCartAmount}</span>
          </p>
          <p className="flex justify-between">
            <span>Shipping Fee</span>
            <span className="text-green-600">Free</span>
          </p>
          <p className="flex justify-between">
            <span>Platform fee (5%)</span>
            <span>₹{Math.ceil(getCartAmount * 0.05)}</span>
          </p>
          <p className="flex justify-between text-lg font-medium mt-3">
            <span>Total Amount:</span>
            <span>₹{Math.ceil(getCartAmount * 1.05)}</span>
          </p>
        </div>

        <button
          onClick={() => {
            userData ? placeOrder() : dispatch(setShowUserLogin(true));
          }}
          disabled={loading}
          className="w-full py-3 mt-6 cursor-pointer bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition"
        >
          {loading
            ? "Placing Order..."
            : paymentOption === "COD"
            ? " Place Order"
            : "Proceed to Checkout"}
        </button>
      </div>
    </div>
  );
};

export default Cart;
