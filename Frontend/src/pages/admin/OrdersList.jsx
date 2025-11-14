/* eslint-disable react-hooks/exhaustive-deps */
import { MdError } from "react-icons/md";
import { assets } from "../../assets/assets";
import { Fragment, useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import adminApi from "../../api/adminApi";
import Loading from "../../components/Loading";
import { motion } from "framer-motion";

const OrdersList = () => {
  const { toast } = useContext(AppContext);
  const [allOrders, setAllOrders] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const response = await adminApi.get("/orders/admin");
      if (response.status === 200) {
        setAllOrders(response.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await adminApi.patch(`/orders/${orderId}`, {
        orderStatus: newStatus,
      });
      if (response.status === 200) {
        toast.success(response.data.message);
        fetchAllOrders();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const filteredOrders = filter
    ? allOrders.filter((order) => order.orderStatus === filter)
    : allOrders;

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-auto bg-gray-50">
      <div className="md:p-10 p-4 space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Platform Orders
            </h2>
            <p className="text-gray-500 text-sm">
              Manage and track all customer orders across the platform.
            </p>
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 text-sm rounded-md p-2.5 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Orders Section */}
        {filteredOrders.length > 0 ? (
          <div className="grid gap-5">
            {filteredOrders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all p-5"
              >
                {/* Top Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-3 mb-3 gap-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Order ID:</span>{" "}
                    {order._id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Date:</span>{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Payment:</span>{" "}
                    <span
                      className={`font-medium ${
                        order.paymentStatus === "Paid"
                          ? "text-emerald-600"
                          : "text-orange-500"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </p>
                </div>

                {/* Order Items */}
                <div className="grid md:grid-cols-2 gap-5">
                  {/* Items */}
                  <div>
                    {order.items.map((item) => (
                      <div
                        key={item.product._id}
                        className="flex items-center gap-3 mb-3 border-b border-gray-100 pb-2 last:border-0 last:pb-0"
                      >
                        <img
                          src={item.product.images?.[0] || assets.box_icon}
                          alt="Product"
                          className="w-12 h-12 object-cover rounded-md border"
                        />
                        <div>
                          <p className="font-medium text-gray-800">
                            {item.product.name}{" "}
                            <span className="text-emerald-600">
                              ×{item.quantity}
                            </span>
                          </p>
                          <p className="text-sm text-gray-500">
                            Sold by: {item.seller?.storeName || "N/A"}
                          </p>
                          <p className="text-xs text-gray-400">
                            Status: {item.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Right Section */}
                  <div className="flex flex-col justify-between gap-3">
                    <div className="text-sm text-gray-600">
                      <p className="font-medium text-gray-800 mb-1">
                        {order.shippingAddress.recipientName}
                      </p>
                      <p>
                        {order.shippingAddress.street},{" "}
                        {order.shippingAddress.city}
                      </p>
                      <p>
                        {order.shippingAddress.state},{" "}
                        {order.shippingAddress.zipCode}
                      </p>
                      <p>{order.shippingAddress.country}</p>
                      <p>{order.shippingAddress.recipientPhone}</p>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <p className="text-lg font-semibold text-gray-900">
                        ₹{order.totalAmount.toLocaleString()}
                      </p>

                      {/* Status */}
                      {["Delivered", "Cancelled"].includes(
                        order.orderStatus
                      ) ? (
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            order.orderStatus === "Delivered"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      ) : (
                        <select
                          value={order.orderStatus}
                          onChange={(e) =>
                            handleStatusUpdate(order._id, e.target.value)
                          }
                          className="text-xs border border-gray-300 rounded-md p-1.5 focus:ring-1 focus:ring-emerald-500 outline-none bg-white"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[70vh] gap-3">
            <MdError className="text-5xl text-gray-400" />
            <p className="text-gray-600 font-medium text-center">
              No {filter ? filter.toLowerCase() : ""} orders found on the
              platform.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersList;
