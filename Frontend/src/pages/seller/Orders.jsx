/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { MdError } from "react-icons/md";
import sellerApi from "../../api/sellerApi";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { assets } from "../../assets/assets";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const { toast } = useContext(AppContext);
  const sellerData = useSelector((state) => state.auth.sellerData);
  const [filter, setFilter] = useState("");

  const fetchOrders = async () => {
    try {
      const response = await sellerApi.get("/sellers/me/orders");
      if (response.status === 200) {
        setOrders(response.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch orders");
    }
  };

  const handleStatusUpdate = async (orderId, productId, status) => {
    try {
      const response = await sellerApi.patch(
        `/orders/${orderId}/item/${productId}`,
        { status }
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        fetchOrders();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // --- Handle seller account review states ---
  if (sellerData?.status === "Pending") {
    return (
      <div className="flex h-[90vh] items-center justify-center">
        <div className="flex items-center gap-3 bg-yellow-100 text-yellow-800 px-6 py-4 rounded-md shadow-md">
          <MdError className="text-3xl" />
          <p className="text-base font-medium">
            Your account is under review. You’ll be notified once approved.
          </p>
        </div>
      </div>
    );
  }

  if (sellerData?.status === "Rejected") {
    return (
      <div className="flex h-[90vh] items-center justify-center">
        <div className="flex items-center gap-3 bg-red-100 text-red-600 px-6 py-4 rounded-md shadow-md">
          <MdError className="text-3xl" />
          <p className="text-base font-medium">
            Your seller account was not approved. Please contact support.
          </p>
        </div>
      </div>
    );
  }

  // --- Filter Logic ---
  const filteredOrders = filter
    ? orders.filter((order) =>
        order.items.some((item) => item.status === filter)
      )
    : orders;

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-auto bg-gray-50">
      <div className="md:p-10 p-4 space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <h2 className="text-2xl font-semibold text-gray-800">
            Seller Orders
          </h2>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 text-sm rounded-md p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
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
            {filteredOrders.map((order) => {
              const sellerItems = order.items.filter(
                (item) => item?.seller.toString() === sellerData?._id.toString()
              );

              const totalAmount = sellerItems.reduce(
                (total, item) =>
                  total +
                  (item.product.offerPrice || item.product.price) *
                    item.quantity,
                0
              );

              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-3 mb-3">
                    <p className="text-sm text-gray-600">
                      Order ID:{" "}
                      <span className="font-semibold text-gray-800">
                        {order._id.slice(-8).toUpperCase()}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Date:{" "}
                      <span className="font-medium">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Payment:{" "}
                      <span
                        className={`font-semibold ${
                          order.paymentStatus === "Paid"
                            ? "text-emerald-600"
                            : "text-orange-500"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </p>
                  </div>

                  {/* Items */}
                  <div className="space-y-3">
                    {sellerItems.map((item) => (
                      <div
                        key={item.product._id}
                        className="flex items-start md:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item?.product?.images[0] || assets.box_icon}
                            alt="Product"
                            className="w-12 h-12 rounded-md border object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-800">
                              {item.product.name}{" "}
                              <span className="text-emerald-600">
                                x{item.quantity}
                              </span>
                            </p>
                            <p className="text-sm text-gray-500">
                              ₹
                              {(
                                (item.product.offerPrice ||
                                  item.product.price) * item.quantity
                              ).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* Status */}
                        {["Delivered", "Cancelled"].includes(item.status) ? (
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              item.status === "Delivered"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {item.status}
                          </span>
                        ) : (
                          <select
                            value={item.status}
                            onChange={(e) =>
                              handleStatusUpdate(
                                order._id,
                                item.product._id,
                                e.target.value
                              )
                            }
                            className="text-xs border border-gray-300 rounded-md p-1.5 bg-white focus:ring-1 focus:ring-emerald-500 transition"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="mt-5 flex flex-col md:flex-row justify-between items-start md:items-center text-sm text-gray-600 border-t pt-3">
                    <div>
                      <p className="font-medium text-gray-800">
                        {order.shippingAddress.recipientName}
                      </p>
                      <p>
                        {order.shippingAddress.street},{" "}
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state} -{" "}
                        {order.shippingAddress.zipCode}
                      </p>
                      <p>{order.shippingAddress.country}</p>
                      <p>{order.shippingAddress.recipientPhone}</p>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 mt-2 md:mt-0">
                      Total: ₹{totalAmount.toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="flex h-[60vh] items-center justify-center">
            <div className="flex flex-col items-center gap-3 bg-gray-100 px-6 py-8 rounded-lg shadow-inner">
              <MdError className="text-4xl text-gray-400" />
              <p className="text-gray-600 font-medium">
                No orders yet — start selling to see your first order here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
