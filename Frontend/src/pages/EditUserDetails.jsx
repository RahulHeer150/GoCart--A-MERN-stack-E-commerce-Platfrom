import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../components/Loading";
import { AppContext } from "../context/AppContext";
import userApi from "../api/userApi";
import { setUserData } from "../features/auth/authSlice";

const EditUserDetails = () => {
  const { toast, navigate } = useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const userData = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      name,
      email,
      phoneNumber,
    };
    try {
      const response = await userApi.patch("/users/me/details", data);
      if (response.status === 200) {
        toast.success(response.data.message);
        dispatch(setUserData(response.data.data));
        navigate("/account");
        scrollTo(0, 0);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData) {
      setName(userData.name);
      setEmail(userData.email);
      setPhoneNumber(userData.phoneNumber);
    }
  }, [userData]);

  if (!userData) {
    return <Loading />;
  }

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between relative mt-5">
      {loading && <Loading />}
      <form
        onSubmit={onSubmitHandler}
        className="md:p-10 p-4 space-y-5 max-w-lg mx-auto w-3/5"
      >
        <h1 className="text-2xl md:text-3xl font-medium mb-4 md:mb-6">
          Edit User Info
        </h1>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="name">
            Name
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            id="name"
            type="text"
            placeholder="Enter Name"
            className=" md:py-2.5 py-2 px-3 rounded border border-gray-500/40 outline-emerald-600"
          />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="email">
            Email
          </label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            id="email"
            type="email"
            placeholder="Enter Email"
            className=" md:py-2.5 py-2 px-3 rounded border border-gray-500/40 outline-emerald-600"
          />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="phone-number">
            Phone Number
          </label>
          <input
            onChange={(e) => setPhoneNumber(e.target.value)}
            value={phoneNumber}
            id="phone-number"
            type="text"
            placeholder="Enter Phone Number"
            className=" md:py-2.5 py-2 px-3 rounded border border-gray-500/40 outline-emerald-600"
          />
        </div>
        <button
          type="submit"
          className="text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 w-full rounded-xl cursor-pointer"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditUserDetails;
