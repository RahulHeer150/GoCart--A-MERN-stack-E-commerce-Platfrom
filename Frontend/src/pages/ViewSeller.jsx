/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { MdVerified } from "react-icons/md";
import { AppContext } from "../context/AppContext";
import Loading from "../components/Loading";
import { HiOutlineMail, HiOutlinePhone } from "react-icons/hi";
import { IoStorefrontOutline } from "react-icons/io5";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAllProducts } from "../features/products/productSlice";
import { ApiUrl } from "../constants";

const ViewSeller = () => {
  const { navigate, toast } = useContext(AppContext);
  const { sellerId } = useParams();

  const products = useSelector(selectAllProducts);

  const [loading, setLoading] = useState(false);
  const [sellerInfo, setSellerInfo] = useState(null);

  const fetchSeller = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${ApiUrl}/sellers/${sellerId}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setSellerInfo(response.data.data);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load Seller Info"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(
    (product) => product.seller._id === sellerId
  );

  useEffect(() => {
    fetchSeller();
  }, []);

  if (!sellerInfo) {
    return (
      <div className="flex-1 p-8 text-center text-gray-600">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="no-scrollbar flex-1 min-h-[95vh] overflow-y-scroll mt-12 bg-gray-50/70 rounded-xl">
      {loading && <Loading />}
      <div className="max-w-6xl mx-auto p-4 md:p-10">
        <div className="bg-white shadow-md rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6 border border-gray-100 mb-10">
          <img
            src={sellerInfo.storeImage}
            alt="Store"
            className="rounded-full w-40 h-40 object-cover shadow-md border-4 border-white"
          />

          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              {sellerInfo.storeName}
              {sellerInfo.isVerified && (
                <MdVerified className="text-emerald-600 text-2xl" />
              )}
            </h2>

            <div className="flex gap-3 mt-2">
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                {sellerInfo.status}
              </span>
              {sellerInfo.isVerified && (
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700">
                  Verified Seller
                </span>
              )}
            </div>

            <p className="mt-3 text-gray-600 text-sm max-w-lg">
              Trusted seller providing high quality products and fast delivery
              🚀
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm flex items-center gap-4">
            <HiOutlineMail className="text-2xl text-emerald-600" />
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">
                Email
              </p>
              <p className="font-medium text-gray-900">{sellerInfo.email}</p>
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm flex items-center gap-4">
            <HiOutlinePhone className="text-2xl text-emerald-600" />
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">
                Phone
              </p>
              <p className="font-medium text-gray-900">
                {sellerInfo.phoneNumber}
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm flex items-center gap-4">
            <IoStorefrontOutline className="text-2xl md:text-5xl text-emerald-600" />
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">
                Store Address
              </p>
              <p className="font-medium text-gray-900 leading-relaxed">
                {sellerInfo.address?.street}, {sellerInfo.address?.city},{" "}
                {sellerInfo.address?.state} {sellerInfo.address?.zipCode},{" "}
                {sellerInfo.address?.country}
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          Products by {sellerInfo.storeName}
        </h3>

        {filteredProducts.length === 0 ? (
          <div className="text-center text-gray-500 py-20 text-lg">
            No products from this seller yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5 pb-10">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                onClick={() => {
                  navigate(`/products/${product.category.name}/${product._id}`);
                  scrollTo(0, 0);
                }}
                className="bg-[#e5f3f3] p-4 rounded-xl shadow-sm hover:shadow-lg border border-gray-100 cursor-pointer transition hover:-translate-y-1"
              >
                <img
                  src={product.images[0]}
                  className="h-32 w-full object-cover rounded-lg"
                  alt={product.name}
                />
                <p className="mt-2 font-medium text-gray-900 truncate">
                  {product.name}
                </p>
                <p className="text-emerald-600 font-semibold">
                  ₹{product.offerPrice}{" "}
                  <span className="ml-1 text-xs line-through text-gray-500">
                    ₹{product.price}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewSeller;
