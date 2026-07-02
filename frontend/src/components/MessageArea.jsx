import React, { useRef } from "react";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { GiCancel } from "react-icons/gi";
import { setSelectedUser } from "../redux/userSlice";
import { RiEmojiStickerLine } from "react-icons/ri";
import { FaImages } from "react-icons/fa6";
import { MdSend } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SenderMessage from "./SenderMessage";
import ReceiverMessage from "./ReceiverMessage";
import axios from "axios";
import { serverUrl } from "../main";
import { toast } from "react-toastify";
import { setMessages } from "../redux/messageSlice";
function MessageArea() {
  const image = useRef();

  let { selectedUser, userData } = useSelector((state) => state.user);
  const [emoji, setEmoji] = useState(false);
  let [input, setInput] = useState("");
  let dispatch = useDispatch();
  const onEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
    setEmoji(false);
  };

  let [frontendImage, setFrontendImage] = useState("");
  let [backendImage, setBackendImage] = useState("");
  const { messages = [] } = useSelector((state) => state.message);
  const handleMessage = (e) => {
    let file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!selectedUser?._id) return;
    if (!input.trim() && !backendImage) return;

    try {
      let formData = new FormData();
      formData.append("message", input);

      if (backendImage) {
        formData.append("image", backendImage);
      }

      let { data } = await axios.post(
        `${serverUrl}/api/message/send/${selectedUser._id}`,
        formData,
        { withCredentials: true },
      );

      if (!data.status) {
        toast.error(data.message);
        return;
      }

      const newMessage = data?.data || data?.newMessage || null;
      if (newMessage) {
        dispatch(setMessages([...messages, newMessage]));
      }

      setBackendImage(null);
      setFrontendImage(null);
      setInput("");
    } catch (error) {
      console.log(error);
    }
  };

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

      {/* Message Area */}

      <div className="relative w-full h-[73vh] lg:h-[760px] flex flex-col py-[30px] px-[20px] overflow-auto no-scrollbar">
        {(messages || []).filter(Boolean).map((msg) => {
          const isSender = msg?.sender === userData?._id;

          return isSender ? (
            <SenderMessage
              key={msg?._id || Math.random()}
              image={msg?.image}
              message={msg?.message}
            />
          ) : (
            <ReceiverMessage
              key={msg?._id || Math.random()}
              image={msg?.image}
              message={msg?.message}
            />
          );
        })}
      </div>
      <div className="w-full  lg:w-[70%] h-[100px] fixed bottom-[20px] flex items-center justify-center">
        <form
          onSubmit={handleSendMessage}
          className="relative flex items-center gap-[10px] w-[95%] lg:w-[70%] h-[60px] bg-black/30 backdrop-blur-xl rounded-full px-[5px]"
        >
          <img
            hidden={!frontendImage}
            src={frontendImage}
            alt="message image"
            className="w-[100px] h-[100px] absolute top-[-101px] right-[20px] rounded"
          />

          <AnimatePresence>
            {emoji && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="absolute  bottom-[65px] mx-1 z-10"
              >
                <EmojiPicker
                  className="z-50"
                  onEmojiClick={onEmojiClick}
                  width={350}
                  height={400}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div
            className={`p-1.5 rounded-full hover:bg-black/30 ${emoji && "bg-black/30"} transition-all  cursor-pointer `}
            onClick={() => setEmoji((prev) => !prev)}
          >
            <RiEmojiStickerLine className="h-[30px] w-[30px] text-white/70" />
          </div>
          <input
            type="file"
            accept="image/*"
            hidden
            ref={image}
            onChange={handleMessage}
          />
          <input
            type="text"
            name=""
            id=""
            className="w-full h-full bg-transparent  outline-none text-[18px] text-white/90 placeholder:text-white/70"
            placeholder="Type a message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div
            className="p-2 rounded-full hover:bg-black/30 transition-all  cursor-pointer"
            onClick={() => image.current.click()}
          >
            <FaImages className="h-[25px] w-[25px]  text-white/70" />
          </div>
          <button
            type="submit"
            className=" rounded-full w-[40px] h-[40px] bg-white shrink-0 hover:bg-white/70 transition-all  cursor-pointer flex justify-center items-center"
          >
            <MdSend
              className=" p-1 hover:text-black text-black/70 transition-all"
              size={30}
            />
          </button>
        </form>
      </div>
    </div>
  );
}

export default MessageArea;
