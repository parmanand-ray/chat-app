import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdPersonAdd, MdSearch } from "react-icons/md";
import { serverUrl } from "../main";
import { toast } from "react-toastify";
import axios from "axios";
import { RiLogoutCircleLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { setAllUser, setSelectedUser, setUserData } from "../redux/userSlice";

function Sidebar() {
  const { userData, allUsers, selectedUser, onlineUsers } = useSelector(
    (state) => state.user,
  );

  const users = allUsers || [];

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      let verify = confirm("You want to logout?");
      if (!verify) return;
      let { data } = await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      if (data.status) {
        dispatch(setAllUser(null));
        dispatch(setUserData(null));
        toast.success(data.message);
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };
  return (
    <div
      className={`lg:w-[30%] w-full h-screen bg-gray-100 overflow-y-auto ${selectedUser ? "hidden" : "block"} lg:block no-scrollbar`}
    >
      {/* Header */}

      <div className=" bg-[#292b2a] rounded-b-[50%] h-[150px] px-8 py-8 shadow-lg ">
        <div className="flex justify-between items-center">
          <div className="">
            <h1 className=" text-5xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 text-transparent bg-clip-text ">
              Talko
            </h1>

            <h2 className="text-gray-200 text-xl mt-1 mb-3">
              Hey{" "}
              <span className="text-green-400 font-bold capitalize">
                {(userData?.name || userData?.username).toLowerCase()}
              </span>
              👋
            </h2>
          </div>

          <img
            onClick={() => navigate("/profile")}
            src={userData?.image || "no-image.jpg"}
            className=" w-[90px] h-[90px] rounded-full border-4 cursor-pointer border-green-400 object-cover "
          />
        </div>
      </div>

      {/* Stories */}

      <div
        onWheel={(e) => {
          const el = e.currentTarget;

          if (el.scrollWidth > el.clientWidth) {
            e.preventDefault();
            el.scrollLeft += e.deltaY;
          }
        }}
        className="flex gap-5 px-1 md:px-5  mt-2 overflow-x-auto no-scrollbar sticky top-14.5 z-20 bg-gray-100"
      >
        {users
          ?.filter((user) => onlineUsers?.includes(user._id))
          ?.map((user) => (
            <div
              key={user?.name || user?.username}
              className="flex flex-col items-center min-w-[90px] cursor-pointer"
              onClick={() => dispatch(setSelectedUser(user))}
            >
              <div className="relative">
                <img
                  src={user?.image || "no-image.jpg"}
                  className=" w-[80px] h-[80px] rounded-full object-cover border-4 border-white shadow "
                />

                <span className=" absolute right-1 bottom-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white "></span>
              </div>

              <p className="mt-0.5 font-semibold text-sm text-center capitalize">
                {(user?.name || user?.username).toLowerCase()}
              </p>
            </div>
          ))}
      </div>

      {/* Search */}

      <div className="px-5 mt-1 flex gap-3 sticky top-1 z-20 bg-gray-100">
        <div className=" bg-white flex items-center gap-3 mb-1 rounded-full px-5 h-[55px] flex-1 shadow ">
          <MdSearch size={28} />

          <input
            placeholder="Search users..."
            className=" outline-none w-full "
          />
        </div>

        <button className=" bg-white rounded-full w-[55px] shadow flex items-center justify-center ">
          <MdPersonAdd size={28} />
        </button>
      </div>

      {/* Online Users */}

      <div className="px-5 mt-2 ">
        <h2 className=" text-2xl font-bold flex items-center gap-3 ">
          <span className=" w-4 h-4 bg-green-500 rounded-full " />
          Online Users
        </h2>

        <div className="mt-5 space-y-4 max-h-[70%] mb-1 overflow-y-auto no-scrollbar">
          {users.map((user) => (
            <div
              key={user?.name || user?.username}
              className=" bg-white rounded-2xl p-4 flex items-center gap-4 shadow hover:bg-gray-200 transition-all"
              onClick={() => dispatch(setSelectedUser(user))}
            >
              <div className="relative">
                <img
                  src={user?.image || "no-image.jpg"}
                  className=" w-[55px] h-[55px] rounded-full object-cover "
                />
                {onlineUsers?.includes(user._id) && (
                  <span className=" absolute right-0 bottom-0.5 w-5 h-5 bg-green-500 rounded-full border-2 border-white "></span>
                )}
              </div>
              <div>
                <h3 className="font-bold text-lg capitalize">
                  {(user?.name || user?.username).toLowerCase()}
                </h3>

                <p className="text-green-500">Online</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={handleLogout}
        className=" bg-red-400 rounded-full w-[55px] h-[55px] shadow flex items-center justify-center absolute bottom-10 left-5 cursor-pointer"
      >
        <RiLogoutCircleLine className="text-white" size={31} />
      </button>
    </div>
  );
}

export default Sidebar;
