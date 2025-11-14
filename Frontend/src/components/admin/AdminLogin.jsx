/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminAuth } from "../../features/auth/authSlice";
import axios from "axios";
import { ApiUrl } from "../../constants";

const AdminLogin = () => {
  const { toast, navigate } = useContext(AppContext);
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const dispatch = useDispatch();

  const [hidePassword, setHidePassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const LoginAdmin = async () => {
    const data = { email, password };
    setLoading(true);
    try {
      const response = await axios.post(`${ApiUrl}/admin/login`, data, {
        withCredentials: true,
      });
      if (response.status === 200) {
        toast.success(response.data.message);
        await dispatch(fetchAdminAuth());
        navigate("/admin");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    LoginAdmin();
  };

  useEffect(() => {
    if (isAdmin) navigate("/admin");
  }, [isAdmin]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100">
      <form
        onSubmit={onSubmitHandler}
        className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-2xl p-8 w-[90%] sm:w-[400px] text-gray-700 animate-fadeIn"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-emerald-700">
            FreshCart
          </h1>
          <p className="text-gray-500 text-sm mt-1 tracking-wide">
            Admin Dashboard Login
          </p>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            placeholder="admin@example.com"
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-300 transition"
          />
        </div>

        {/*  Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Password
          </label>
          <div className="flex items-center px-3 py-2 border border-gray-300 rounded-lg focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-300 transition">
            <input
              type={hidePassword ? "password" : "text"}
              value={password}
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
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

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold py-2.5 rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-xs text-gray-500 mt-6">
          © {new Date().getFullYear()} FreshCart Admin Console
        </p>
      </form>
    </div>
  );
};

export default AdminLogin;
