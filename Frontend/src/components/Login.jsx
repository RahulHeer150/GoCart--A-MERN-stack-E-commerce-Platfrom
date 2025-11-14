import { useContext, useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa6";
import { AppContext } from "../context/AppContext";
import { useDispatch, useSelector } from "react-redux";
import { addAndUpdateCart, fetchCart } from "../features/cart/cartSlice";
import { fetchUserAuth } from "../features/auth/authSlice";
import { setShowUserLogin } from "../features/ui/uiSlice";
import { selectAllProducts } from "../features/products/productSlice";
import axios from "axios";
import { ApiUrl } from "../constants";

const Login = () => {
  const [state, setState] = useState("login");
  const [hidePassword, setHidePassword] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const { toast } = useContext(AppContext);
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);

  const setLocalCartToDB = async () => {
    const localCart = JSON.parse(localStorage.getItem("cartItems"));
    if (localCart && localCart.length > 0) {
      toast.loading("Syncing your cart...");
      for (const item of localCart) {
        const fullProduct = products.find((p) => p._id === item.product._id);
        if (fullProduct) {
          await dispatch(
            addAndUpdateCart({ product: fullProduct, quantity: item.quantity })
          );
        }
      }
      localStorage.removeItem("cartItems");
      toast.dismiss();
      toast.success("Cart merged successfully!");
    }
  };

  const registerUser = async () => {
    const data = { name, email, password, phoneNumber };
    try {
      const response = await axios.post(`${ApiUrl}/users/register`, data, {
        withCredentials: true,
      });
      if (response.status === 201) {
        toast.success(response.data.message);
        await dispatch(fetchUserAuth());
        await setLocalCartToDB();
        await dispatch(fetchCart());
        dispatch(setShowUserLogin(false));
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration failed. Try again."
      );
    }
  };

  const loginUser = async () => {
    const data = { email, password };
    try {
      const response = await axios.post(`${ApiUrl}/users/login`, data, {
        withCredentials: true,
      });
      if (response.status === 200) {
        await dispatch(fetchUserAuth());
        await setLocalCartToDB();
        await dispatch(fetchCart());
        dispatch(setShowUserLogin(false));
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed. Try again.");
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (state === "register") await registerUser();
    else await loginUser();
  };

  return (
    <div
      onClick={() => dispatch(setShowUserLogin(false))}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn"
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={onSubmitHandler}
        className="bg-white/90 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-2xl p-8 w-[90%] sm:w-[360px] text-gray-700 flex flex-col gap-4 transition-all animate-scaleIn"
      >
        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          {state === "login" ? "Welcome Back " : "Create Account "}
        </h2>

        {/* Name Field */}
        {state === "register" && (
          <div>
            <label className="text-sm font-medium text-gray-600">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-300 transition"
            />
          </div>
        )}

        {/* Email Field */}
        <div>
          <label className="text-sm font-medium text-gray-600">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-300 transition"
          />
        </div>

        {/* Password Field */}
        <div>
          <label className="text-sm font-medium text-gray-600">Password</label>
          <div className="flex items-center mt-1 px-3 py-2 border border-gray-300 rounded-lg focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-300 transition">
            <input
              type={hidePassword ? "password" : "text"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              className="flex-1 outline-none bg-transparent"
            />
            {hidePassword ? (
              <FaRegEye
                className="text-gray-500 cursor-pointer"
                onClick={() => setHidePassword(false)}
              />
            ) : (
              <FaRegEyeSlash
                className="text-gray-500 cursor-pointer"
                onClick={() => setHidePassword(true)}
              />
            )}
          </div>
        </div>

        {/* Phone Field */}
        {state === "register" && (
          <div>
            <label className="text-sm font-medium text-gray-600">
              Phone Number
            </label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-300 transition"
            />
          </div>
        )}

        {/* Switch Login/Register */}
        <p className="text-sm text-center mt-2">
          {state === "register" ? "Already have an account? " : "New here? "}
          <span
            onClick={() =>
              setState(state === "register" ? "login" : "register")
            }
            className="text-emerald-600 hover:text-emerald-700 font-medium cursor-pointer transition"
          >
            {state === "register" ? "Login" : "Create one"}
          </span>
        </p>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold py-2.5 rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          {state === "register" ? "Sign Up" : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
