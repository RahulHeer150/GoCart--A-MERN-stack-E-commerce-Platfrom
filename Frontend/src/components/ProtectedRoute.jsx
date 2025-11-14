/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { setShowUserLogin } from "../features/ui/uiSlice";
import Loading from "./Loading";

const ProtectedRoute = ({ children }) => {
  const { toast } = useContext(AppContext);
  const dispatch = useDispatch();

  const { userData, status } = useSelector((state) => state.auth);

  const location = useLocation();

  useEffect(() => {
    if (status === "failed") {
      toast.error("You must be logged in to view this page.");
      dispatch(setShowUserLogin(true));
    }
  }, [status]);

  if (status === "idle" || status === "loading") {
    return <Loading />;
  }

  if (!userData) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
