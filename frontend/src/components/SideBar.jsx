import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdPersonAdd, MdSearch } from "react-icons/md";
import { serverUrl } from "../main";
import { toast } from "react-toastify";
import axios from "axios";
import { RiLogoutCircleLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import {
  setAllUser,
  setSelectedUser,
  setUserData,
  updateUserLastMessage,
} from "../redux/userSlice";

function Sidebar() {
  const { userData, allUsers, selectedUser, onlineUsers } = useSelector(
    (state) => state.user,
  );

  const [searchTerm, setSearchTerm] = useState("");

  const users = allUsers || [];

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const name = user?.name || user?.username || "";
      return name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [users, searchTerm]);

  const onlineStoryUsers = useMemo(() => {
    return users.filter((user) => onlineUsers?.includes(user?._id));
  }, [users, onlineUsers]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSelectUser = (user) => {
    dispatch(setSelectedUser(user));

    dispatch(
      updateUserLastMessage({
        userId: user._id,
        unreadCount: 0,
      }),
    );
  };

  const formatLastMessageAt = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const isToday = date.toDateString() === new Date().toDateString();
    const time = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return isToday ? time : `${date.toLocaleDateString()} ${time}`;
  };

  const handleLogout = async () => {
    try {
      const verify = confirm("You want to logout?");
      if (!verify) return;

      const { data } = await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });

      if (data.status) {
        dispatch(setAllUser(null));
        dispatch(setSelectedUser(null));
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
      className={`
        relative h-[100dvh] w-full bg-gray-100 overflow-hidden
        lg:w-[30%] xl:w-[28%] 2xl:w-[25%]
        ${selectedUser ? "hidden lg:flex" : "flex"}
        flex-col
      `}
    >
      {/* Header */}
      <div className="shrink-0 bg-[#292b2a] rounded-b-[38px] sm:rounded-b-[50%] px-4 sm:px-8 py-6 sm:py-8 shadow-lg">
        <div className="flex justify-between items-center gap-4">
          <div className="min-w-0">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 text-transparent bg-clip-text">
              Talko
            </h1>

            <h2 className="text-gray-200 text-base sm:text-xl mt-1 mb-2 truncate">
              Hey{" "}
              <span className="text-green-400 font-bold capitalize">
                {(userData?.name || userData?.username || "User").toLowerCase()}
              </span>
              👋
            </h2>
          </div>

          <img
            onClick={() => navigate("/profile")}
            src={userData?.image || "no-image.jpg"}
            alt="Profile"
            className="w-16 h-16 sm:w-[90px] sm:h-[90px] rounded-full border-4 cursor-pointer border-green-400 object-cover shrink-0"
          />
        </div>
      </div>

      {/* Stories */}
      {userData?.role === "admin" && (
        <div className="shrink-0 px-5 pb-3 bg-gray-100">
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="w-1/3 rounded-2xl bg-green-500 text-white py-3 text-sm font-semibold hover:bg-green-600 transition"
          >
            Admin Panel
          </button>
        </div>
      )}

      <div
        onWheel={(e) => {
          const el = e.currentTarget;

          if (el.scrollWidth > el.clientWidth) {
            e.preventDefault();
            el.scrollLeft += e.deltaY;
          }
        }}
        className="shrink-0 flex gap-4 sm:gap-5 px-3 sm:px-5 pt-3 pb-2 overflow-x-auto no-scrollbar bg-gray-100"
      >
        {onlineStoryUsers.length > 0 ? (
          onlineStoryUsers.map((user) => (
            <div
              key={user?._id}
              className="flex flex-col items-center min-w-[72px] sm:min-w-[90px] cursor-pointer"
              onClick={() => handleSelectUser(user)}
            >
              <div className="relative">
                <img
                  src={user?.image || "no-image.jpg"}
                  alt={user?.name || user?.username || "User"}
                  className="w-16 h-16 sm:w-[80px] sm:h-[80px] rounded-full object-cover border-4 border-white shadow"
                />

                <span className="absolute right-1 bottom-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full border-2 border-white" />
              </div>

              <p className="mt-1 font-semibold text-xs sm:text-sm text-center capitalize max-w-[80px] truncate">
                {(user?.name || user?.username || "user").toLowerCase()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 py-3"></p>
        )}
      </div>

      {/* Search */}
      <div className="shrink-0 px-3 sm:px-5 pb-3 bg-gray-100">
        <div className="flex gap-3">
          <div className="bg-white flex items-center gap-3 rounded-full px-4 sm:px-5 h-12 sm:h-[55px] flex-1 shadow">
            <MdSearch size={26} className="text-gray-600 shrink-0" />

            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users..."
              className="outline-none w-full bg-transparent text-sm sm:text-base"
            />
          </div>

          <button
            type="button"
            className="bg-white rounded-full w-12 h-12 sm:w-[55px] sm:h-[55px] shadow flex items-center justify-center shrink-0"
          >
            <MdPersonAdd size={26} />
          </button>
        </div>
      </div>

      {/* Users List - only this part scrolls */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-3 sm:px-5 pb-24">
        <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-3 mb-4">
          <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-green-500 rounded-full" />
          Chats
        </h2>

        <div className="space-y-3 sm:space-y-4">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => {
              const isOnline = onlineUsers?.includes(user?._id);
              const isSelectedChat =
                String(user?._id) === String(selectedUser?._id);

              const unreadCount = Number(user?.unreadCount || 0);
              return (
                <div
                  key={user?._id}
                  className="bg-white rounded-2xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4 shadow hover:bg-gray-200 transition-all cursor-pointer"
                  onClick={() => handleSelectUser(user)}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <img
                      src={user?.image || "no-image.jpg"}
                      alt={user?.name || user?.username || "User"}
                      className="w-[50px] h-[50px] sm:w-[55px] sm:h-[55px] rounded-full object-cover"
                    />

                    {isOnline && (
                      <span className="absolute right-0 bottom-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>

                  {/* Name + Last Message */}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-base sm:text-lg capitalize truncate">
                      {(user?.name || user?.username || "user").toLowerCase()}
                    </h3>

                    <p
                      className={`truncate text-sm ${
                        !isSelectedChat && unreadCount > 0
                          ? "text-gray-900 font-semibold"
                          : "text-gray-500"
                      }`}
                    >
                      {user?.lastMessage?.image
                        ? "📷 Photo"
                        : user?.lastMessage?.message || "Start a chat"}
                    </p>
                  </div>

                  {/* Time + Unread Badge */}
                  <div className="shrink-0 min-w-[48px] flex flex-col items-end justify-between self-stretch py-1">
                    <span
                      className={`text-xs ${
                        !isSelectedChat && unreadCount > 0
                          ? "text-green-500 font-bold"
                          : "text-gray-400"
                      }`}
                    >
                      {formatLastMessageAt(user?.lastMessageAt)}
                    </span>

                    {!isSelectedChat && unreadCount > 0 && (
                      <span className="min-w-5 h-5 px-1.5 rounded-full bg-green-500 text-white text-[11px] font-bold flex items-center justify-center">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-2xl p-5 text-center text-gray-500 shadow">
              No users found
            </div>
          )}
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="absolute bottom-[72px] left-4 sm:left-5 z-30 bg-red-400 rounded-full w-12 h-12 sm:w-[55px] sm:h-[55px] shadow flex items-center justify-center cursor-pointer hover:bg-red-500 transition"
      >
        <RiLogoutCircleLine className="text-white" size={30} />
      </button>

      {/* Footer */}
      <div className="shrink-0 h-14 bg-gray-100 px-5 flex items-center justify-center">
        <div className="w-full h-full flex items-center justify-center border-t border-gray-300 text-xs sm:text-sm text-gray-600 text-center">
          Your personal messages are private and secure.
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
