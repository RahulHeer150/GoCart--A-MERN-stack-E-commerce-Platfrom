import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../components/Loading";
import { HiOutlineMail, HiOutlinePhone } from "react-icons/hi";
import { FaCirclePlus } from "react-icons/fa6";
import { MdEdit, MdLockOutline } from "react-icons/md";
import userApi from "../api/userApi";
import { setUserData } from "../features/auth/authSlice";

const UserProfile = () => {
  const { toast, navigate } = useContext(AppContext);
  const dispatch = useDispatch();

  const userData = useSelector((state) => state.auth.userData);

  const [avatar, setAvatar] = useState(
    "https://ik.imagekit.io/kmqpfzfho/profile_icon.png?updatedAt=1762311565402"
  );
  const [loading, setLoading] = useState(false);

  const changeAvatar = async (e) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("avatar", e.target.files[0]);
    try {
      const response = await userApi.patch("/users/me/avatar", formData);
      if (response.status === 200) {
        toast.success("Avatar updated successfully");
        const newUserData = response.data.data;
        setAvatar(newUserData.avatar);
        dispatch(setUserData(newUserData));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Avatar update failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData?.avatar) {
      setAvatar(userData.avatar);
    }
  }, [userData]);

  if (!userData) {
    return (
      <div className="flex-1 p-8 text-center text-gray-600">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="no-scrollbar flex-1 mt-12 h-[95vh] overflow-y-scroll bg-gray-50/70 rounded-xl">
      {loading && <Loading />}

      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
            Hello, <span className="text-emerald-600">{userData.name}</span>
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your profile & account settings
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="md:col-span-1 flex flex-col items-center text-center bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition">
            {/* Avatar */}
            <div className="relative group">
              <img
                src={avatar}
                alt="Profile"
                className="rounded-full w-44 h-44 object-cover border-[5px] border-white shadow-lg ring-emerald-400 ring-offset-2 ring-offset-white group-hover:ring-emerald-500 transition-all duration-300"
              />

              {/* Upload Button */}
              <label
                htmlFor="image"
                className="absolute bottom-2 right-2 cursor-pointer bg-white rounded-full p-2 shadow-md hover:shadow-lg transition ring-2 ring-emerald-500/10"
              >
                <input id="image" type="file" hidden onChange={changeAvatar} />
                <FaCirclePlus className="text-2xl text-emerald-600 hover:text-emerald-700" />
              </label>
            </div>

            {/* Name & Email */}
            <h2 className="text-2xl font-semibold text-gray-900 mt-5">
              {userData.name}
            </h2>
            <p className="text-gray-500 text-sm">{userData.email}</p>

            {/* Buttons */}
            <div className="w-full mt-6 space-y-3">
              <button
                onClick={() => {
                  navigate("/edit-account");
                  scrollTo(0, 0);
                }}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium shadow-md hover:bg-emerald-700 hover:shadow-xl active:scale-95 transition cursor-pointer"
              >
                <MdEdit size={18} /> Edit Profile
              </button>

              <button
                onClick={() => {
                  navigate("change-password");
                  scrollTo(0, 0);
                }}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg border border-gray-200 font-medium shadow-sm hover:bg-gray-200 hover:shadow transition active:scale-95 cursor-pointer"
              >
                <MdLockOutline size={18} /> Change Password
              </button>
            </div>
          </div>

          {/* Detail Section */}
          <div className="md:col-span-2 bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition">
            <h2 className="text-xl font-semibold text-gray-700 mb-6 flex items-center gap-2">
              🔐 Account Information
            </h2>

            <div className="space-y-5">
              {/* Email */}
              <div className="border border-gray-200 p-5 rounded-xl bg-white flex items-start gap-4 hover:border-emerald-300 hover:shadow-md transition">
                <HiOutlineMail className="text-2xl text-emerald-600 mt-1" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                    Email
                  </p>
                  <p className="font-medium text-gray-900">{userData.email}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="border border-gray-200 p-5 rounded-xl bg-white flex items-start gap-4 hover:border-emerald-300 hover:shadow-md transition">
                <HiOutlinePhone className="text-2xl text-emerald-600 mt-1" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                    Phone
                  </p>
                  <p className="font-medium text-gray-900">
                    {userData.phoneNumber}
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

export default UserProfile;
