import React from "react";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { GiCancel } from "react-icons/gi";
import { setSelectedUser } from "../redux/userSlice";

function MessageArea() {
  let { selectedUser } = useSelector((state) => state.user);

  let dispatch = useDispatch();

  if (!selectedUser) {
    return (
      <div className="lg:w-[70%]  hidden lg:block w-full bg-slate-400 border-l-2 border-cyan-400 ">
        <div className="w-full  flex flex-col justify-center h-[90%] items-center">
          <h1 className="text-gray-700 font-bold text-[50px]">
            Welcome to Talko.
          </h1>
          <span className="text-gray-700 font-semibold text-[30px]">
            Chat Friendly !
          </span>
        </div>
      </div>
    );
  }
  return (
    <div
      className={`lg:w-[70%] relative ${!selectedUser ? "hidden" : "block"} lg:block w-full bg-slate-400 border-l-2 border-cyan-400 `}
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-black/30 backdrop-blur-xl border-b-1  border-b-cyan-300 h-[80px] px-8 py-8 shadow-lg ">
        <div className="flex gap-2 items-center">
          <img
            src={selectedUser?.image || "no-image.jpg"}
            className=" w-[50px] h-[50px] rounded-full  border-green-400 object-cover "
          />
          <div className="flex flex-col gap-0">
            <p className="text-green-400 font-bold text-2xl leading-none capitalize">
              {(selectedUser?.name || selectedUser?.username).toLowerCase()}
            </p>
            <small className="leading-none text-gray-300 mt-0.5">online</small>
          </div>
        </div>

        <div
          className="h-[40px] w-[40px] flex items-center justify-center text-red-300 hover:text-red-400 transition-all  rounded-full cursor-pointer"
          onClick={() => dispatch(setSelectedUser(null))}
        >
          <GiCancel size={30} />
        </div>
      </div>
      <div className="w-full h-[100px] fixed bottom-[20px] ">
        <form
          action="
"
        ></form>
      </div>
    </div>
  );
}

export default MessageArea;
