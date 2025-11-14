/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { fetchProducts } from "../features/products/productSlice";
import {
  fetchAdminAuth,
  fetchSellerAuth,
  fetchUserAuth,
} from "../features/auth/authSlice";
// import { fetchCart } from "../features/cart/cartSlice";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const handleUserAuth = async () => {
  //   const userAuthResult = await dispatch(fetchUserAuth());
  //   // if (userAuthResult.meta.requestStatus === "fulfilled") {
  //   //   dispatch(fetchCart());
  //   // }
  // };

  useEffect(() => {
    dispatch(fetchProducts());
    const path = window.location.pathname;
    if (path.startsWith("/admin")) {
      dispatch(fetchAdminAuth());
    } else if (path.startsWith("/seller")) {
      dispatch(fetchSellerAuth());
    } else {
      // handleUserAuth();
      dispatch(fetchUserAuth());
    }
  }, []);

  const value = {
    toast,
    navigate,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
