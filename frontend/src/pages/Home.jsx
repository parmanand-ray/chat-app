import React from "react";
import SideBar from "../components/SideBar";
import MessageArea from "../components/MessageArea";
import { useDispatch } from "react-redux";
import { setAllUser } from "../redux/userSlice";

const Home = () => {
  return (
    <div className="w-full h-[100vh] flex">
      <SideBar />
      <MessageArea />
    </div>
  );
};

export default Home;
