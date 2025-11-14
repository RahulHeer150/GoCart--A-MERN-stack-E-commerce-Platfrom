/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import userApi from "../api/userApi";
import { AppContext } from "../context/AppContext";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";

const InputField = ({ type, placeholder, name, handleChange, value }) => (
  <input
    className="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-emerald-600 transition"
    type={type}
    placeholder={placeholder}
    name={name}
    onChange={handleChange}
    value={value}
    required
  />
);

const EditAddressDetails = () => {
  const { toast, navigate } = useContext(AppContext);
  const { addressId } = useParams();

  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState({
    recipientName: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    recipientPhone: "",
    addressType: "",
    isDefault: false,
  });

  const fetchAddressDetails = async () => {
    setLoading(true);
    try {
      const response = await userApi.get(`/addresses/${addressId}`);
      if (response.status === 200) {
        setAddress(response.data.data);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch address details"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setAddress((prevAddress) => ({
        ...prevAddress,
        [name]: checked,
      }));
    } else {
      setAddress((prevAddress) => ({
        ...prevAddress,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    fetchAddressDetails();
  }, []);

  const onSumbitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (address.addressType === "") {
      toast.error("Please select addressType");
      return;
    }

    const data = {
      recipientName: address.recipientName,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      recipientPhone: address.recipientPhone,
      addressType: address.addressType,
      isDefault: address.isDefault,
    };
    try {
      const response = await userApi.patch(`/addresses/${addressId}`, data);
      if (response.status === 200) {
        toast.success(response.data.message);
        navigate("/addresses");
        scrollTo(0, 0);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to save address details"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16 pb-16">
      {loading && <Loading />}
      <p className="text-2xl md:text-3xl text-gray-500">
        Edit Shipping{" "}
        <span className="font-semibold text-emerald-600">Address</span>
      </p>
      <div className="flex flex-col-reverse md:flex-row justify-between mt-10 ">
        <div className="flex-1 max-w-md">
          <form onSubmit={onSumbitHandler} className="space-y-3 mt-6 text-sm">
            <InputField
              handleChange={handleChange}
              value={address.recipientName}
              name="recipientName"
              type="text"
              placeholder="Recipient Name"
            />
            <InputField
              handleChange={handleChange}
              value={address.street}
              name="street"
              type="text"
              placeholder="Street"
            />
            <div className="grid grid-cols-2 gap-6">
              <InputField
                handleChange={handleChange}
                value={address.city}
                name="city"
                type="text"
                placeholder="City"
              />
              <InputField
                handleChange={handleChange}
                value={address.state}
                name="state"
                type="text"
                placeholder="State"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <InputField
                handleChange={handleChange}
                value={address.zipCode}
                name="zipCode"
                type="text"
                placeholder="Zip Code"
              />
              <InputField
                handleChange={handleChange}
                value={address.country}
                name="country"
                type="text"
                placeholder="Country"
              />
            </div>
            <InputField
              handleChange={handleChange}
              value={address.recipientPhone}
              name="recipientPhone"
              type="text"
              placeholder="Phone"
            />
            <select
              className="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-emerald-600 transition"
              value={address.addressType}
              onChange={handleChange}
              name="addressType"
            >
              <option value="">Select your Address Type</option>
              <option value="Home">Home</option>
              <option value="Office">Office</option>
              <option value="Other">Other</option>
            </select>
            <div className="w-full flex items-center justify-start gap-2">
              <input
                type="checkbox"
                name="isDefault"
                id="isDefault"
                checked={address.isDefault}
                onChange={handleChange}
              />
              <label htmlFor="isDefault">Is this is your default address</label>
            </div>
            <button className="w-full mt-6 bg-emerald-600 text-white py-3 hover:bg-emerald-700 transition cursor-pointer uppercase">
              Save Address
            </button>
          </form>
        </div>
        <img
          className="md:mr-16 mb-16 md:mt-0"
          src={assets.add_address_iamge}
          alt="Add Address"
        />
      </div>
    </div>
  );
};

export default EditAddressDetails;
