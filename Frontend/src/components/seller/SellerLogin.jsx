import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { fetchSellerAuth } from "../../features/auth/authSlice.js";
import axios from "axios";
import { ApiUrl } from "../../constants.js";

const SellerLogin = () => {
  const { navigate, toast } = useContext(AppContext);
  const isSeller = useSelector((state) => state.auth.isSeller);
  const dispatch = useDispatch();

  const [state, setState] = useState("login");
  const [hidePassword, setHidePassword] = useState(true);
  const [storeName, setStoreName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const registerSeller = async () => {
    const data = { storeName, email, password, phoneNumber, address };
    try {
      const response = await axios.post(`${ApiUrl}/sellers/register`, data, {
        withCredentials: true,
      });
      if (response.status === 201) {
        toast.success(response.data.message);
        await dispatch(fetchSellerAuth());
        navigate("/seller");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  const loginSeller = async () => {
    const data = { email, password };
    try {
      const response = await axios.post(`${ApiUrl}/sellers/login`, data, {
        withCredentials: true,
      });
      if (response.status === 200) {
        toast.success(response.data.message);
        await dispatch(fetchSellerAuth());
        navigate("/seller");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    state === "register" ? registerSeller() : loginSeller();
  };

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (isSeller) navigate("/seller");
    // eslint-disable-next-line
  }, [isSeller]);

  return (
    !isSeller && (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white">
        <form
          onSubmit={onSubmitHandler}
          className="bg-white/90 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-2xl p-8 w-[90%] sm:w-[420px] text-gray-700 animate-fadeIn"
        >
          <div className="text-center mb-6">
            <h2 className="text-3xl font-extrabold text-emerald-700">
              FreshCart
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Seller {state === "login" ? "Login" : "Registration"}
            </p>
          </div>

          {state === "register" && (
            <div className="mb-3">
              <label className="text-sm font-medium text-gray-600">
                Store Name
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Enter Store Name"
                required
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-300 outline-none transition"
              />
            </div>
          )}

          <div className="mb-3">
            <label className="text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email"
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-300 outline-none transition"
            />
          </div>

          <div className="mb-3">
            <label className="text-sm font-medium text-gray-600">
              Password
            </label>
            <div className="flex items-center mt-1 px-3 py-2 border border-gray-300 rounded-lg focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-300 transition">
              <input
                type={hidePassword ? "password" : "text"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
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

          {state === "register" && (
            <>
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-600">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter Phone Number"
                  required
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-300 outline-none transition"
                />
              </div>

              <p className="text-sm text-gray-700 font-semibold mb-1">
                Address Details
              </p>

              <div className="grid grid-cols-2 gap-2">
                <input
                  name="street"
                  value={address.street}
                  onChange={handleAddressChange}
                  placeholder="Street"
                  className="input-field"
                  required
                />
                <input
                  name="city"
                  value={address.city}
                  onChange={handleAddressChange}
                  placeholder="City"
                  className="input-field"
                  required
                />
                <input
                  name="state"
                  value={address.state}
                  onChange={handleAddressChange}
                  placeholder="State"
                  className="input-field"
                  required
                />
                <input
                  name="zipCode"
                  value={address.zipCode}
                  onChange={handleAddressChange}
                  placeholder="Zip Code"
                  className="input-field"
                  required
                />
                <input
                  name="country"
                  value={address.country}
                  onChange={handleAddressChange}
                  placeholder="Country"
                  className="col-span-2 input-field"
                  required
                />
              </div>
            </>
          )}

          <p className="text-sm mt-4 text-center">
            {state === "register" ? "Already have an account?" : "New Seller?"}{" "}
            <span
              onClick={() =>
                setState(state === "register" ? "login" : "register")
              }
              className="text-emerald-600 hover:text-emerald-700 font-medium cursor-pointer"
            >
              {state === "register" ? "Login" : "Register"}
            </span>
          </p>

          <button
            type="submit"
            className="w-full mt-5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold py-2.5 rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            {state === "register" ? "Register Store" : "Login"}
          </button>
        </form>
      </div>
    )
  );
};

export default SellerLogin;
