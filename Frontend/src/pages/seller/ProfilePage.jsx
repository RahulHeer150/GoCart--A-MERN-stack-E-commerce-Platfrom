import { useContext, useEffect, useState } from "react";
import { MdEdit, MdVerified, MdLockOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { FaCirclePlus } from "react-icons/fa6";
import { AppContext } from "../../context/AppContext";
import sellerApi from "../../api/sellerApi";
import { setSellerData } from "../../features/auth/authSlice";
import Loading from "../../components/Loading";
import { HiOutlineMail, HiOutlinePhone } from "react-icons/hi";
import { IoStorefrontOutline } from "react-icons/io5";

const ProfilePage = () => {
  const { navigate, toast } = useContext(AppContext);
  const dispatch = useDispatch();

  const sellerData = useSelector((state) => state.auth.sellerData);

  const [storeImage, setStoreImage] = useState(
    "https://ik.imagekit.io/kmqpfzfho/shop.png?updatedAt=1761891900082"
  );
  const [loading, setLoading] = useState(false);

  const handleChange = async (e) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("storeImage", e.target.files[0]);
    try {
      const response = await sellerApi.patch(
        "/sellers/me/storeImage",
        formData
      );
      if (response.status === 200) {
        toast.success("Store image updated successfully");
        const newSellerData = response.data.data;
        setStoreImage(newSellerData.storeImage);
        dispatch(setSellerData(newSellerData));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Image update failed");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (sellerData?.storeImage) {
      setStoreImage(sellerData.storeImage);
    }
  }, [sellerData]);

  if (!sellerData) {
    return (
      <div className="flex-1 p-8 text-center text-gray-600">
        Loading profile...
      </div>
    );
  }

  const StatusBadge = () => {
    if (sellerData.status === "Approved") {
      return (
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
          {sellerData.isVerified ? "Verified" : "Approved"}
        </span>
      );
    }
    if (sellerData.status === "Pending") {
      return (
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700">
          Pending Review
        </span>
      );
    }
    if (sellerData.status === "Rejected") {
      return (
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-600">
          Account Rejected
        </span>
      );
    }
    return null;
  };

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll bg-gray-50">
      {loading && <Loading />}

      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 flex flex-col items-center text-center bg-white p-6 rounded-xl shadow-sm">
            <div className="relative">
              <img
                src={storeImage}
                alt="Store"
                className="rounded-full w-48 h-48 object-cover bg-gray-100 shadow-md border-4 border-white"
              />
              <label
                className="absolute bottom-2 right-2 cursor-pointer p-1 bg-white rounded-full shadow-md"
                htmlFor="image"
              >
                <input id="image" type="file" hidden onChange={handleChange} />
                <FaCirclePlus className="text-3xl text-emerald-600 hover:text-emerald-700 transition" />
              </label>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-1 flex items-center gap-2">
              {sellerData.storeName}
              {sellerData.isVerified && (
                <MdVerified className="text-emerald-600 text-2xl" />
              )}
            </h2>
            <p className="text-gray-600 text-sm">{sellerData.email}</p>

            <div className="w-full mt-6 space-y-3">
              <button
                onClick={() => {
                  navigate("/seller/edit-seller");
                  scrollTo(0, 0);
                }}
                className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold shadow hover:bg-emerald-700 transition cursor-pointer"
              >
                <MdEdit size={18} /> Edit Profile
              </button>
              <button
                onClick={() => {
                  navigate("/seller/change-password");
                  scrollTo(0, 0);
                }}
                className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold shadow-sm hover:bg-gray-200 transition cursor-pointer"
              >
                <MdLockOutline size={18} /> Change Password
              </button>
            </div>
          </div>

          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Welcome to your Dashboard
            </h1>
            <div className="space-y-5">
              <div className="border border-gray-200 p-5 rounded-xl bg-white shadow-sm">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">
                  Account Status
                </p>
                <div className="flex items-center gap-4">
                  <StatusBadge />
                  <p className="font-medium text-gray-700">
                    {sellerData.status === "Pending" &&
                      "Your account is under review."}
                    {sellerData.status === "Approved" && "Your store is live!"}
                    {sellerData.status === "Rejected" &&
                      "Your account was not approved."}
                  </p>
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                <div className="border border-gray-200 p-5 rounded-xl hover:shadow-md transition bg-white flex items-start gap-4">
                  <HiOutlineMail className="text-2xl text-emerald-600 mt-1" />
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">
                      Email
                    </p>
                    <p className="font-medium text-gray-900">
                      {sellerData.email}
                    </p>
                  </div>
                </div>

                <div className="border border-gray-200 p-5 rounded-xl hover:shadow-md transition bg-white flex items-start gap-4">
                  <HiOutlinePhone className="text-2xl text-emerald-600 mt-1" />
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">
                      Phone
                    </p>
                    <p className="font-medium text-gray-900">
                      {sellerData.phoneNumber}
                    </p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="border border-gray-200 p-5 rounded-xl hover:shadow-md transition bg-white flex items-start gap-4">
                <IoStorefrontOutline className="text-2xl text-emerald-600 mt-1" />
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">
                    Store Address
                  </p>
                  <p className="font-medium text-gray-900 leading-relaxed">
                    {sellerData.address?.street}, {sellerData.address?.city},{" "}
                    {sellerData.address?.state} {sellerData.address?.zipCode},{" "}
                    {sellerData.address?.country}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
