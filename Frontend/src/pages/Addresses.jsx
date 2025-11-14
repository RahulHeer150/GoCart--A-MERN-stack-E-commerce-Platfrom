/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import Loading from "../components/Loading";
import userApi from "../api/userApi";
import { AppContext } from "../context/AppContext";
import { MdEdit, MdDelete, MdErrorOutline } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";

const Addresses = () => {
  const { toast, navigate } = useContext(AppContext);

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAddresses = async () => {
    try {
      const response = await userApi.get("/addresses");
      if (response.status === 200) {
        setAddresses(response.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch addresses");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    setLoading(true);
    try {
      const response = await userApi.delete(`/addresses/${id}`);
      if (response.data) {
        toast.success(response.data.message);
        fetchAddresses();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete address");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 max-w-4xl mx-auto h-[95vh] overflow-y-auto no-scrollbar bg-gradient-to-b from-emerald-50/50 to-white pt-10 mt-5">
      {loading && (
        <div className="flex h-[80vh] items-center justify-center">
          <Loading />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            My Addresses
          </h1>
          <p className="text-gray-500 text-sm">
            Manage your delivery locations
          </p>
        </div>

        <button
          onClick={() => {
            navigate("/address");
            scrollTo(0, 0);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold shadow hover:bg-emerald-700 hover:shadow-lg transition-all active:scale-95"
        >
          <FaPlus className="text-sm" />
          Add New
        </button>
      </div>

      {/* Empty state */}
      {addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[55vh] text-center px-4">
          <MdErrorOutline className="text-6xl text-gray-300 mb-3" />
          <h2 className="text-xl font-semibold text-gray-700">
            No Addresses Yet
          </h2>
          <p className="text-gray-500 mb-4">
            Add a delivery address to get started
          </p>

          <button
            onClick={() => {
              navigate("/address");
              scrollTo(0, 0);
            }}
            className="px-5 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 active:scale-95 transition flex items-center gap-2"
          >
            <FaPlus /> Add Address
          </button>
        </div>
      ) : (
        <div className="space-y-4 pb-10">
          {addresses.map((address) => (
            <div
              key={address._id}
              className="
              bg-white border border-gray-100 shadow-sm
              rounded-xl p-5 hover:shadow-lg transition-all hover:-translate-y-[2px]
            "
            >
              {/* Title Row */}
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-lg flex items-center gap-2 text-gray-800">
                  🏠 {address.addressType}
                  {address.isDefault && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      Default
                    </span>
                  )}
                </h2>

                <div className="flex gap-4 text-xl">
                  <MdEdit
                    onClick={() => {
                      navigate(`/addresses/edit/${address._id}`);
                      scrollTo(0, 0);
                    }}
                    className="text-emerald-500 hover:text-emerald-600 cursor-pointer transition"
                  />
                  <MdDelete
                    onClick={() => handleDeleteAddress(address._id)}
                    className="text-red-500 hover:text-red-600 cursor-pointer transition"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="grid md:grid-cols-3 gap-4 text-gray-700 text-sm">
                <div>
                  <p className="font-medium">{address.recipientName}</p>
                  <p className="text-gray-500">{address.recipientPhone}</p>
                </div>
                <div>
                  <p>{address.street}</p>
                  <p className="text-gray-500">{address.city}</p>
                </div>
                <div>
                  <p>
                    {address.state} - {address.zipCode}
                  </p>
                  <p className="text-gray-500">{address.country}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Addresses;
