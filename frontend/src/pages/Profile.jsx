import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaCamera, FaLongArrowAltRight, FaLongArrowAltLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { serverUrl } from "../main";
import { toast } from "react-toastify";
import axios from "axios";
import { setUserData } from "../redux/userSlice";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { userData } = useSelector((state) => state.user);

  const profileImg = userData?.image || "/no-image.jpg";

  const [name, setName] = useState(userData?.name || "");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(profileImg);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setName(userData?.name || "");
    setPreview(userData?.image || "/no-image.jpg");
  }, [userData]);

  const handleLogout = async () => {
    try {
      const verify = confirm("You want to logout?");
      if (!verify) return;

      setIsLoggingOut(true);

      const result = await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });

      if (result.data.status) {
        dispatch(setUserData(null));
        toast.success("Logout Successful");
        navigate("/login");
      } else {
        toast.error(result.data.message || "Logout failed");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Logout failed"
      );
      console.log(error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("name", name.trim());

      if (image) {
        formData.append("image", image);
      }

      const { data } = await axios.put(
        `${serverUrl}/api/user/profile`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.status) {
        dispatch(setUserData(data.user));
        setImage(null);
        toast.success(data.message || "Profile updated successfully");
      } else {
        toast.error(data.message || "Profile update failed");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Profile update failed"
      );
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-gray-100 flex items-center justify-center px-4 py-24">
      {/* Top Background */}
      <div className="absolute top-0 left-0 w-full h-[260px] bg-[#292b2a] rounded-b-[45px] shadow-lg" />

      {/* Top Actions */}
      <div className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md border border-white/10 transition hover:bg-white/20"
        >
          <FaLongArrowAltLeft size={18} />
          <span className="hidden xs:inline">Go Home</span>
          <span className="xs:hidden">Back</span>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`
            inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-md transition
            ${
              isLoggingOut
                ? "bg-red-300 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            }
          `}
        >
          <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
          {!isLoggingOut && <FaLongArrowAltRight size={18} />}
        </button>
      </div>

      {/* Profile Card */}
      <form
        onSubmit={handleUpdate}
        encType="multipart/form-data"
        className="
          relative z-10 w-full max-w-[430px]
          bg-white rounded-[32px] shadow-2xl
          px-5 sm:px-7 pt-8 pb-7
          flex flex-col items-center
        "
      >
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 text-transparent bg-clip-text">
            Profile
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your personal information
          </p>
        </div>

        {/* Image */}
        <div className="relative mb-7">
          <div className="relative w-[155px] h-[155px] sm:w-[180px] sm:h-[180px] rounded-full p-1 bg-gradient-to-r from-green-400 to-cyan-400 shadow-xl">
            <div className="w-full h-full rounded-full overflow-hidden bg-gray-200 border-4 border-white">
              <img
                src={preview}
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <label
            htmlFor="profileImage"
            className="absolute bottom-3 right-2 w-12 h-12 rounded-full bg-[#00dcb8] hover:bg-[#00c4a4] text-white flex items-center justify-center shadow-lg transition cursor-pointer border-4 border-white"
          >
            <FaCamera size={18} />
          </label>

          <input
            type="file"
            id="profileImage"
            name="image"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];

              if (file) {
                setImage(file);
                setPreview(URL.createObjectURL(file));
              }
            }}
            className="hidden"
          />
        </div>

        {/* User Data */}
        <div className="w-full space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-bold text-gray-700"
            >
              Name
            </label>

            <input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="
                w-full h-[52px] rounded-2xl bg-gray-100
                border-2 border-transparent
                focus:border-[#00dcb8] focus:bg-white
                outline-none px-5 text-gray-800
                placeholder:text-gray-400 transition
              "
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="username"
              className="block text-sm font-bold text-gray-700"
            >
              Username
            </label>

            <input
              type="text"
              name="username"
              id="username"
              value={userData?.username || ""}
              readOnly
              placeholder="Username"
              className="
                w-full h-[52px] rounded-2xl bg-gray-100
                border-2 border-transparent
                outline-none px-5 text-gray-400 cursor-not-allowed
              "
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-bold text-gray-700"
            >
              Email Address
            </label>

            <input
              type="email"
              name="email"
              id="email"
              value={userData?.email || ""}
              readOnly
              placeholder="Email address"
              className="
                w-full h-[52px] rounded-2xl bg-gray-100
                border-2 border-transparent
                outline-none px-5 text-gray-400 cursor-not-allowed
              "
            />
          </div>
        </div>

        {/* Save Button */}
        <button
          disabled={isLoading || !name.trim()}
          type="submit"
          className={`
            mt-7 w-full h-[52px] rounded-2xl font-bold text-white shadow-lg
            flex items-center justify-center transition
            ${
              isLoading || !name.trim()
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#00dcb8] hover:bg-[#00c4a4] active:scale-[0.98]"
            }
          `}
        >
          {isLoading ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            "Save Changes"
          )}
        </button>

        <p className="mt-5 text-center text-xs sm:text-sm text-gray-500">
          Your personal information stays private and secure.
        </p>
      </form>
    </div>
  );
};

export default Profile;