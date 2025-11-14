/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import { AppContext } from "../../context/AppContext";
import { MdVerified, MdOutlineStore } from "react-icons/md";
import Loading from "../../components/Loading";
import { FaCheck } from "react-icons/fa6";
import { FcCancel } from "react-icons/fc";
import { motion } from "framer-motion";

const SellersList = () => {
  const { toast } = useContext(AppContext);
  const [sellersData, setSellersData] = useState([]);
  const [status, setStatus] = useState("");
  const [filteredSellers, setFilteredSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSellers = async () => {
    setLoading(true);
    try {
      const response = await adminApi.get("/sellers");
      if (response.status === 200) {
        setSellersData(response.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch sellers");
    } finally {
      setLoading(false);
    }
  };

  const updateStatusCall = async (id, status, isVerified) => {
    const data = { status, isVerified };
    try {
      const response = await adminApi.patch(`/sellers/${id}/status`, data);
      if (response.status === 200) {
        toast.success(response.data.message);
        fetchSellers();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update seller");
    }
  };

  useEffect(() => {
    if (status === "") setFilteredSellers(sellersData);
    else setFilteredSellers(sellersData.filter((s) => s.status === status));
  }, [status, sellersData]);

  useEffect(() => {
    fetchSellers();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="h-[95vh] overflow-y-auto bg-gray-50 px-4 md:px-10 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Seller Management
          </h2>
          <p className="text-gray-500 text-sm">
            Approve, reject, or review seller's applications.
          </p>
        </div>

        <select
          onChange={(e) => setStatus(e.target.value)}
          name="status"
          value={status}
          className="border border-gray-300 text-sm rounded-md p-2.5 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
        >
          <option value="">All Sellers</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Sellers Grid */}
      {filteredSellers.length > 0 ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSellers.map((seller, index) => (
            <motion.div
              key={seller._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              {/* Store Banner / Image */}
              {seller.storeImage ? (
                <img
                  className="w-full h-40 object-cover"
                  src={seller.storeImage}
                  alt="Seller Store"
                />
              ) : (
                <div className="w-full h-40 flex items-center justify-center bg-gray-100">
                  <MdOutlineStore className="text-4xl text-gray-400" />
                </div>
              )}

              {/* Seller Info */}
              <div className="p-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <p className="font-medium text-gray-800 text-lg truncate">
                    {seller.storeName}
                  </p>
                  {seller.isVerified && (
                    <MdVerified className="text-emerald-600 text-lg" />
                  )}
                </div>

                <p className="text-sm text-gray-500 mt-1">{seller.email}</p>
                <p className="text-sm text-gray-500">{seller.phoneNumber}</p>

                {/* Status Buttons */}
                {seller.status === "Approved" && (
                  <span className="mt-4 inline-block bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium">
                    Approved
                  </span>
                )}
                {seller.status === "Rejected" && (
                  <span className="mt-4 inline-block bg-red-100 text-red-700 px-4 py-1.5 rounded-full text-sm font-medium">
                    Rejected
                  </span>
                )}
                {seller.status === "Pending" && (
                  <div className="mt-4 border border-gray-300 rounded-full flex items-center justify-between px-4 py-1.5 text-sm text-gray-700 bg-gray-50">
                    <span>Pending</span>
                    <div className="flex gap-3 text-base">
                      <FaCheck
                        onClick={() =>
                          updateStatusCall(seller._id, "Approved", true)
                        }
                        className="text-emerald-600 hover:text-emerald-700 cursor-pointer"
                        title="Approve Seller"
                      />
                      <FcCancel
                        onClick={() =>
                          updateStatusCall(seller._id, "Rejected", false)
                        }
                        className="hover:opacity-80 cursor-pointer"
                        title="Reject Seller"
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[70vh] text-gray-500 w-[100vw]">
          <p className="text-5xl mb-2">🛍️</p>
          <p className="text-lg font-medium">
            No {status ? status.toLowerCase() : ""} sellers found.
          </p>
        </div>
      )}
    </div>
  );
};

export default SellersList;
