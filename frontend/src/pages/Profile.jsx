import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaCamera, FaLongArrowAltRight } from "react-icons/fa";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { serverUrl } from "../main";
import { toast } from "react-toastify";
import axios from "axios";
import { setUserData } from "../redux/userSlice";
const Profile = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  let { userData } = useSelector((state) => state.user);
  const profileImg = userData?.image ? userData.image : "/no-image.jpg";

  const [name, setName] = useState(userData.name || "");
  const [image, setImage] = useState(null); // backend bhejne ke liye file
  const [preview, setPreview] = useState(profileImg); // frontend me dikhane ke liye URL

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
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
        error.response?.data?.message || error.message || "Logout failed",
      );

      console.log(error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (image) {
        formData.append("image", image);
      }

      const { data } = await axios.put(
        `${serverUrl}/api/user/profile`,
        formData,
        { withCredentials: true },
      );

      if (data.status) {
        dispatch(setUserData(data.user));
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }

      setIsLoading(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Logout failed",
      );

      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-300 flex flex-col items-center justify-center px-4">
            <Link
              to="/"
              className="fixed top-5 left-5 z-50 inline-flex items-center gap-2 rounded-full bg-black/70 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-all duration-200 hover:bg-black"
            >
              <FaLongArrowAltLeft size={18} />
              <span>Go Home</span>
            </Link>

      <button
        onClick={handleLogout}
        className="fixed top-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-all duration-200 hover:bg-red-600"
      >
        <span>Logout</span>
        <FaLongArrowAltRight size={18} />
      </button>

      <form
        method="post"
        className="sm:w-[50%] md:w-[30%] flex flex-col items-center gap-5 px-5 py-8"
        enctype="multipart/form-data"
        onSubmit={handleUpdate}
      >
        {/* image */}
        <div className="relative bg-white rounded-full border-4 border-[#00dcb8] shadow-lg  shadow-gray-400" >
          <div className="w-[200px] h-[200px] rounded-full overflow-hidden">


            
            <img
              src={preview}
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>
          <label
            htmlFor="profileImage"
            className="absolute bottom-3 right-3 w-10 h-10 rounded-full hover:bg-[#039c83] bg-[#00dcb8] text-white flex items-center justify-center shadow-md transition-all cursor-pointer"
          >
            <FaCamera />
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
        {/* userdata */}

        <div className="w-full space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-700"
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
              className="w-full h-[50px] outline-none border-2 border-[#8edfd1] focus:border-[#00dcb8] px-5 py-2 bg-white rounded-lg shadow-md shadow-gray-200 text-gray-800 placeholder:text-gray-400"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="username"
              className="block text-sm font-semibold text-gray-700"
            >
              Username
            </label>
            <input
              className="w-full h-[50px] outline-none border-2 border-[#8edfd1]  px-5 py-2 bg-white rounded-lg shadow-md shadow-gray-200  text-gray-400"
              type="text"
              name="username"
              id="username"
              value={userData?.username}
              readOnly
              placeholder="Choose a unique username"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={userData?.email}
              placeholder="Enter your email address"
              className="w-full h-[50px] outline-none border-2 border-[#8edfd1]  px-5 py-2 bg-white rounded-lg shadow-md shadow-gray-200  text-gray-400"
            />
          </div>
        </div>

        <button
          disabled={isLoading}
          type="submit"
          className="w-full h-[50px] bg-[#00dcb8] hover:bg-[#00c4a4] text-white font-bold rounded-lg shadow-md transition-all"
        >
          {isLoading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
