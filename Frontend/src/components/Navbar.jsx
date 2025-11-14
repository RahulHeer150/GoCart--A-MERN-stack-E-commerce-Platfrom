/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { FiShoppingCart } from "react-icons/fi";
import { IoSearchOutline } from "react-icons/io5";
import { RiMenu3Line } from "react-icons/ri";
import userApi from "../api/userApi";
import { useDispatch, useSelector } from "react-redux";
import { clearUserData } from "../features/auth/authSlice";
import { selectCartCount } from "../features/cart/cartSlice";
import { setSearchQuery, setShowUserLogin } from "../features/ui/uiSlice";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { navigate, toast } = useContext(AppContext);

  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const getCartCount = useSelector(selectCartCount);
  const searchQuery = useSelector((state) => state.ui.searchQuery);

  const logout = async () => {
    try {
      const response = await userApi.post("/users/logout");
      if (response.status === 200) {
        toast.success(response.data.message);
        dispatch(clearUserData());
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate("/products");
    }
  }, [searchQuery]);
  // const onSearchSubmit = (e) => {
  //   e.preventDefault();
  //   if (searchQuery.length > 0) {
  //     navigate("/products");
  //   }
  // };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 z-50 transition-all">
      <div className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-3">
        <NavLink
          onClick={() => setOpen(false)}
          to="/"
          className="flex items-center gap-2"
        >
          <img src="/images/image.png" alt="logo" className="h-8 md:h-10" />
          <h1 className="text-2xl md:text-3xl font-extrabold text-emerald-700 tracking-tight">
            Fresh<span className="text-gray-900">Cart</span>
          </h1>
        </NavLink>

        <div className="hidden sm:flex items-center gap-8 text-sm font-medium text-gray-700">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `hover:text-emerald-600 transition ${
                isActive ? "text-emerald-600 font-semibold" : ""
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `hover:text-emerald-600 transition ${
                isActive ? "text-emerald-600 font-semibold" : ""
              }`
            }
          >
            All Products
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `hover:text-emerald-600 transition ${
                isActive ? "text-emerald-600 font-semibold" : ""
              }`
            }
          >
            Contact
          </NavLink>

          <form className="hidden lg:flex items-center gap-2 px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-full shadow-inner focus-within:ring-2 focus-within:ring-emerald-500 transition">
            <IoSearchOutline className="text-gray-500 text-lg" />
            <input
              type="text"
              placeholder="Search groceries..."
              className="bg-transparent outline-none placeholder-gray-400 text-sm w-48"
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            />
          </form>

          <div
            onClick={() => {
              navigate("/cart");
              scrollTo(0, 0);
            }}
            className="relative cursor-pointer hover:scale-[1.05] transition"
          >
            <FiShoppingCart className="text-2xl text-emerald-600" />
            <span className="absolute -top-2 -right-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-[10px] font-semibold w-[18px] h-[18px] flex items-center justify-center rounded-full shadow">
              {getCartCount}
            </span>
          </div>

          {!userData ? (
            <button
              onClick={() => dispatch(setShowUserLogin(true))}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-sm hover:shadow-md transition active:scale-[.98]"
            >
              Login
            </button>
          ) : (
            <div className="relative group">
              <img
                src={userData.avatar}
                alt="profile"
                className="w-9 h-9 rounded-full object-cover border-2 border-emerald-500 cursor-pointer"
              />
              <ul className="absolute hidden group-hover:flex flex-col right-0 top-9 bg-white/95 backdrop-blur-md border border-gray-200 shadow-lg rounded-lg w-44 py-2 text-sm animate-fadeIn">
                <li
                  onClick={() => {
                    navigate("/account");
                    scrollTo(0, 0);
                  }}
                  className="px-4 py-2 hover:bg-emerald-50 cursor-pointer"
                >
                  My Profile
                </li>
                <li
                  onClick={() => {
                    navigate("/orders");
                    scrollTo(0, 0);
                  }}
                  className="px-4 py-2 hover:bg-emerald-50 cursor-pointer"
                >
                  My Orders
                </li>
                <li
                  onClick={() => {
                    navigate("/addresses");
                    scrollTo(0, 0);
                  }}
                  className="px-4 py-2 hover:bg-emerald-50 cursor-pointer"
                >
                  Address Book
                </li>
                <li
                  onClick={logout}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="flex gap-5 items-center sm:hidden">
          <div
            onClick={() => {
              navigate("/cart");
              scrollTo(0, 0);
              setOpen(false);
            }}
            className="relative cursor-pointer"
          >
            <FiShoppingCart className="text-2xl text-emerald-600" />
            <span className="absolute -top-2 -right-3 bg-emerald-600 text-white text-[10px] w-[18px] h-[18px] flex items-center justify-center rounded-full">
              {getCartCount}
            </span>
          </div>

          <button onClick={() => setOpen(!open)} aria-label="Menu">
            <RiMenu3Line className="text-2xl text-gray-700" />
          </button>
        </div>
      </div>

      <div
        className={`sm:hidden absolute top-full left-0 w-full bg-white shadow-md border-t border-gray-100 flex flex-col gap-3 px-5 py-4 text-sm font-medium transition-all duration-300 ${
          open
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <NavLink
          onClick={() => setOpen(false)}
          to="/"
          className="py-1 hover:text-emerald-600"
        >
          Home
        </NavLink>
        <NavLink
          onClick={() => setOpen(false)}
          to="/products"
          className="py-1 hover:text-emerald-600"
        >
          All Products
        </NavLink>
        <NavLink
          onClick={() => setOpen(false)}
          to="/contact"
          className="py-1 hover:text-emerald-600"
        >
          Contact
        </NavLink>
        {userData && (
          <>
            <NavLink
              onClick={() => setOpen(false)}
              to="/account"
              className="py-1 hover:text-emerald-600"
            >
              My Profile
            </NavLink>
            <NavLink
              onClick={() => setOpen(false)}
              to="/orders"
              className="py-1 hover:text-emerald-600"
            >
              My Orders
            </NavLink>
            <NavLink
              onClick={() => setOpen(false)}
              to="/addresses"
              className="py-1 hover:text-emerald-600"
            >
              Address Book
            </NavLink>
          </>
        )}
        {!userData ? (
          <button
            onClick={() => {
              setOpen(false);
              dispatch(setShowUserLogin(true));
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 mt-3 rounded-full"
          >
            Login
          </button>
        ) : (
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 mt-3 rounded-full"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
