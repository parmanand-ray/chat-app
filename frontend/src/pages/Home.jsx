import React from "react";
import SideBar from "../components/SideBar";
import MessageArea from "../components/MessageArea";
import { useDispatch } from "react-redux";
import { setAllUser } from "../redux/userSlice";
import useGetMessages from "../costomHooks/useGetMessages";

const Home = () => {
  useGetMessages();
  return (
    <div className="w-full h-[100vh] flex overflow-hidden">
      <SideBar />
      <MessageArea />
    </div>
  );
};

export default Home;
