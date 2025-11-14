import { useContext, useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa6";
import { MdLockOutline } from "react-icons/md";
import Loading from "../../components/Loading";
import { AppContext } from "../../context/AppContext";
import sellerApi from "../../api/sellerApi";

const ChangePassword = () => {
  const { toast, navigate } = useContext(AppContext);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hideOldPassword, setHideOldPassword] = useState(true);
  const [hideNewPassword, setHideNewPassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const [loading, setLoading] = useState(false);

  const onHandleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }
    setLoading(true);

    const data = {
      oldPassword,
      newPassword,
    };

    try {
      const response = await sellerApi.patch(
        "/sellers/me/change-password",
        data
      );
      if (response.status === 200) {
        toast.success("Password changed successfully");
        navigate("/seller");
        scrollTo(0, 0);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-4 md:p-10 bg-gray-50 h-[95vh] overflow-y-scroll no-scrollbar">
      {loading && <Loading />}
      <h1 className="text-4xl font-medium mb-8 text-gray-800 tracking-tight text-center">
        Change Password
      </h1>
      <form onSubmit={onHandleSubmit} className="max-w-3xl space-y-10 mx-auto">
        <div className="w-full ">
          <label className="font-semibold text-sm cursor-pointer">
            Old Password
            <div className="flex items-center justify-between border border-gray-200 w-full p-2 mt-1 cursor-text transition-all focus-within:border-emerald-600 focus-within:ring-1 rounded-lg">
              <input
                onChange={(e) => setOldPassword(e.target.value)}
                value={oldPassword}
                placeholder="Enter your password"
                className="border-none outline-none flex-1 bg-transparent"
                type={hideOldPassword ? "password" : "text"}
                required
              />
              {hideOldPassword ? (
                <FaRegEye
                  className="text-lg cursor-pointer text-gray-500"
                  onClick={() => setHideOldPassword(false)}
                />
              ) : (
                <FaRegEyeSlash
                  className="text-lg cursor-pointer text-gray-500"
                  onClick={() => setHideOldPassword(true)}
                />
              )}
            </div>
          </label>
        </div>
        <div className="w-full ">
          <label className="font-semibold text-sm cursor-pointer">
            New Password
            <div className="flex items-center justify-between border border-gray-200 w-full p-2 mt-1 cursor-text transition-all focus-within:border-emerald-600 focus-within:ring-1 rounded-lg">
              <input
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
                placeholder="Enter your password"
                className="border-none outline-none flex-1 bg-transparent"
                type={hideNewPassword ? "password" : "text"}
                required
              />
              {hideNewPassword ? (
                <FaRegEye
                  className="text-lg cursor-pointer text-gray-500"
                  onClick={() => setHideNewPassword(false)}
                />
              ) : (
                <FaRegEyeSlash
                  className="text-lg cursor-pointer text-gray-500"
                  onClick={() => setHideNewPassword(true)}
                />
              )}
            </div>
          </label>
        </div>
        <div className="w-full ">
          <label className="font-semibold text-sm cursor-pointer">
            Confirm Password
            <div className="flex items-center justify-between border border-gray-200 w-full p-2 mt-1 cursor-text transition-all focus-within:border-emerald-600 focus-within:ring-1 rounded-lg">
              <input
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                placeholder="Enter your password"
                className="border-none outline-none flex-1 bg-transparent"
                type={hideConfirmPassword ? "password" : "text"}
                required
              />
              {hideConfirmPassword ? (
                <FaRegEye
                  className="text-lg cursor-pointer text-gray-500"
                  onClick={() => setHideConfirmPassword(false)}
                />
              ) : (
                <FaRegEyeSlash
                  className="text-lg cursor-pointer text-gray-500"
                  onClick={() => setHideConfirmPassword(true)}
                />
              )}
            </div>
          </label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-500 text-white rounded-lg text-sm font-semibold shadow-sm hover:bg-emerald-600 transition cursor-pointer"
        >
          {loading ? "Saving..." : "Change Password"}
          <MdLockOutline size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
