/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import userApi from "../api/userApi";
import { AppContext } from "../context/AppContext";
import Loading from "../components/Loading";

const Order = () => {
  const { toast } = useContext(AppContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await userApi.get("/orders");
      if (response.status === 200) {
        setOrders(response.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="px-4 mt-14 md:px-8 max-w-4xl mx-auto h-[95vh] overflow-y-auto no-scrollbar">
      <div className="flex flex-col items-end w-max mb-8 ">
        <p className="text-2xl font-medium uppercase mt-5">My Orders</p>
        <div className="w-16 h-0.5 bg-emerald-500 rounded-full"></div>
      </div>
      {orders.map((order) => (
        <div
          key={order._id}
          className="border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl"
        >
          <p className="flex justify-between md:items-center text-gray-400 md:font-medium max-md:flex-col">
            <span>OrderId : {order._id}</span>
            <span>Payment : {order.paymentMethod}</span>
            <span>Total Amount : ₹{order.totalAmount}</span>
          </p>
          {order?.items.map((item) => (
            <div
              key={item.product._id}
              className={`${
                order.items.length > 1 ? "border-b" : ""
              } relative bg-white text-gray-500/70 border-gray-300 flex flex-col md:flex-row md:items-center justify-between p-4 py-5 md:gap-16 w-full max-w-4xl`}
            >
              <div className="flex items-center mb-4 md:mb-0">
                <div className="bg-emerald-600/10 p-4 rounded-lg">
                  <img
                    src={item.product.images[0]}
                    alt={item.name}
                    className="w-16 h-16"
                  />
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-medium text-gray-800">
                    {item.name}
                  </h2>
                  <p>Category: {item.product.category?.name || "N/A"}</p>
                  <p>From:{item?.seller?.storeName}</p>
                </div>
              </div>
              <div className="flex flex-col justify-center md:ml-8 mb-4 md:mb-0">
                <p>Quantity: {item.quantity}</p>
                <p>Status: {item.status}</p>
                <p>Date : {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <p className="text-emerald-600 text-lg font-medium">
                Amount : ₹{item.price * item.quantity}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Order;
