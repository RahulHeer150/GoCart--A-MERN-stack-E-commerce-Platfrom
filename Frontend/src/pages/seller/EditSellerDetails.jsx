import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import sellerApi from "../../api/sellerApi";
import { useSelector } from "react-redux";
import { MdStorefront, MdLocationOn } from "react-icons/md";
import Loading from "../../components/Loading";

const EditSellerDetails = () => {
  const { toast, navigate } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const sellerData = useSelector((state) => state.auth.sellerData);

  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (sellerData) {
      setFormData(sellerData);
      setLoading(false);
    }
  }, [sellerData]);

  const handleTextChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddressChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [e.target.name]: e.target.value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        storeName: formData.storeName,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
      };

      const response = await sellerApi.patch("/sellers/me/details", updateData);

      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        navigate("/seller");
        scrollTo(0, 0);
        setFormData(response.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
      console.error(error);
    }
  };

  if (loading || !formData) {
    return <Loading />;
  }

  return (
    <div className="flex-1 p-4 md:p-10 bg-gray-50 h-[95vh] overflow-y-scroll no-scrollbar">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 tracking-tight text-center">
        Edit Store Details
      </h1>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-10 mx-auto">
        {/* Store Section */}
        <div className="p-6 rounded-2xl bg-white shadow-lg border border-gray-100 hover:shadow-xl transition">
          <div className="flex items-center gap-2 mb-6">
            <MdStorefront className="text-emerald-600 text-2xl" />
            <h2 className="text-xl font-semibold text-gray-800">
              Store Information
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Store Name
              </label>
              <input
                type="text"
                name="storeName"
                onChange={handleTextChange}
                value={formData.storeName}
                className="mt-1 p-3 w-full bg-gray-50 border rounded-xl border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Email (locked)
              </label>
              <input
                type="email"
                value={formData.email}
                readOnly
                className="mt-1 p-3 w-full border rounded-xl bg-gray-200 cursor-not-allowed"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700">
                Phone Number
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleTextChange}
                className="mt-1 p-3 w-full bg-gray-50 border rounded-xl border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="p-6 rounded-2xl bg-white shadow-lg border border-gray-100 hover:shadow-xl transition">
          <div className="flex items-center gap-2 mb-6">
            <MdLocationOn className="text-emerald-600 text-2xl" />
            <h2 className="text-xl font-semibold text-gray-800">
              Business Address
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700">
                Street
              </label>
              <input
                type="text"
                name="street"
                value={formData.address?.street}
                onChange={handleAddressChange}
                className="mt-1 p-3 w-full bg-gray-50 border rounded-xl border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            {["city", "state", "zipCode", "country"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-semibold text-gray-700 capitalize">
                  {field}
                </label>
                <input
                  type="text"
                  name={field}
                  value={formData.address?.[field]}
                  onChange={handleAddressChange}
                  className="mt-1 p-3 w-full bg-gray-50 border rounded-xl border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg text-lg font-medium tracking-wide transition transform hover:scale-[1.02] active:scale-95 shadow-md"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditSellerDetails;
