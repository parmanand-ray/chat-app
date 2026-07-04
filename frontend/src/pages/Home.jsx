import React from "react";
import SideBar from "../components/SideBar";
import { useDispatch } from "react-redux";
import { setAllUser } from "../redux/userSlice";
import useGetMessages from "../costomHooks/useGetMessages";
import ChatContainer from "../components/ChatContainer";

const Home = () => {
  useGetMessages();
  return (
    <div className="w-full h-[100vh] flex overflow-hidden">
      <SideBar />
      <ChatContainer />
    </div>
  );
};

export default Home;
