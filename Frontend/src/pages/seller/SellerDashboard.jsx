import { useContext, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { CiSquarePlus } from "react-icons/ci";
import { LuListCheck, LuMenu } from "react-icons/lu";
import { PiCalendarCheckLight } from "react-icons/pi";
import { CgProfile } from "react-icons/cg";
import sellerApi from "../../api/sellerApi";
import { useDispatch, useSelector } from "react-redux";
import { clearSellerData } from "../../features/auth/authSlice";

const SellerDashboard = () => {
  const { navigate, toast } = useContext(AppContext);
  const dispatch = useDispatch();

  const sellerData = useSelector((state) => state.auth.sellerData);

  const [showSidebar, setShowSidebar] = useState(false);

  const sidebarLinks = [
    { name: "Profile", path: "/seller", icon: <CgProfile /> },
    {
      name: "Add Product",
      path: "/seller/add-product",
      icon: <CiSquarePlus />,
    },
    {
      name: "Product List",
      path: "/seller/product-list",
      icon: <LuListCheck />,
    },
    { name: "Orders", path: "/seller/orders", icon: <PiCalendarCheckLight /> },
  ];

  const logout = async () => {
    try {
      const response = await sellerApi.post("/sellers/logout");
      if (response.status === 200) {
        toast.success(response.data.message);
        dispatch(clearSellerData());
        navigate("/seller");
        scrollTo(0, 0);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white ">
        <LuMenu
          onClick={() => setShowSidebar((prev) => !prev)}
          className="md:hidden text-2xl cursor-pointer"
        />
        <Link to="/">
          <div className="flex items-center">
            <img className="h-7 md:h-11" src="/images/image.png" alt="logo" />
            <h1 className="text-xl md:text-2xl font-bold text-green-900">
              <span className="text-green-600">Fresh</span>Cart
            </h1>
          </div>
        </Link>
        <div className="flex items-center gap-5 text-gray-500">
          <p className="hidden sm:block">Hi! {sellerData?.storeName}</p>
          <button
            onClick={logout}
            className="border rounded-full text-sm px-4 py-1 cursor-pointer hover:scale-105 transition-all duration-300"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="flex">
        <div
          className={`${
            showSidebar ? "flex" : "hidden"
          } md:flex lg:w-64 w-16 md:h-[95vh] h-screen text-base border-r border-gray-300 pt-4 flex-col fixed md:static z-10 bg-white`}
        >
          {sidebarLinks.map((item, index) => (
            <NavLink
              to={item.path}
              key={index}
              end={item.path === "/seller"}
              onClick={() => setShowSidebar(false)}
              className={({
                isActive: isCurrentActive,
              }) => `flex items-center py-3 px-4 gap-3 
                            ${
                              isCurrentActive
                                ? "border-r-4 md:border-r-[6px] bg-emerald-600/10 border-emerald-600 text-emerald-600"
                                : "hover:bg-gray-100/90 border-white  text-gray-700"
                            }`}
            >
              <span className="text-lg">{item.icon}</span>
              <p className="lg:block hidden text-sm md:text-base text-center">
                {item.name}
              </p>
            </NavLink>
          ))}
        </div>
        <Outlet />
      </div>
    </>
  );
};

export default SellerDashboard;
