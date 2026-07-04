import React, { useEffect, useRef, useState } from "react";
import { IoArrowBack, IoImageOutline, IoSend } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser, updateUserLastMessage } from "../redux/userSlice";
import { serverUrl } from "../main";
import axios from "axios";
import { toast } from "react-toastify";
import SenderMessage from "./SenderMessage";
import ReceiverMessage from "./ReceiverMessage";
function ChatContainer() {
  const { selectedUser, userData, onlineUsers, socket } = useSelector(
    (state) => state.user,
  );

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [fullViewImage, setFullViewImage] = useState(null);
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);

  const isOnline = onlineUsers?.includes(selectedUser?._id);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getMessages = async () => {
    try {
      if (!selectedUser?._id) return;

      const { data } = await axios.get(
        `${serverUrl}/api/message/get/${selectedUser._id}`,
        {
          withCredentials: true,
        },
      );

      setMessages(Array.isArray(data) ? data : []);
      markSelectedChatAsRead();
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };
  const [isSending, setIsSending] = useState(false);
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (isSending) return;
    if (!message.trim() && !image) return;
    if (!selectedUser?._id) return;

    setIsSending(true);

    try {
      const formData = new FormData();
      formData.append("message", message);

      if (image) {
        formData.append("image", image);
      }

      const { data } = await axios.post(
        `${serverUrl}/api/message/send/${selectedUser._id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (data.status) {
        setMessages((prev) => [...prev, data.data]);
        setMessage("");
        setImage(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      console.log(error);
    } finally {
      setIsSending(false);
    }
  };

  const markSelectedChatAsRead = () => {
    if (!socket || !selectedUser?._id || !userData?._id) return;

    socket.emit("markMessagesAsRead", {
      senderId: selectedUser._id,
      receiverId: userData._id,
    });

    dispatch(
      updateUserLastMessage({
        userId: selectedUser._id,
        unreadCount: 0,
      }),
    );
  };

  useEffect(() => {
    getMessages();
  }, [selectedUser?._id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket || !selectedUser?._id) return;

    const handleNewMessage = (data) => {
      if (
        String(data.sender) === String(selectedUser._id) &&
        String(data.receiver) === String(userData?._id)
      ) {
        setMessages((prev) => [...prev, data]);
        dispatch(
          updateUserLastMessage({
            userId: selectedUser._id,
            lastMessage: data,
            lastMessageAt: data.createdAt,
            unreadCount: 0,
          }),
        );

        socket.emit("markMessagesAsRead", {
          senderId: selectedUser._id,
          receiverId: userData._id,
        });
      }
    };

    const handleMessagesRead = (data) => {
      if (String(data.userId) !== String(selectedUser._id)) return;

      setMessages((prev) =>
        prev.map((msg) =>
          String(msg.sender) === String(userData?._id) &&
          String(msg.receiver) === String(selectedUser._id)
            ? {
                ...msg,
                isRead: true,
                readAt: new Date().toISOString(),
              }
            : msg,
        ),
      );
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messagesRead", handleMessagesRead);
    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messagesRead", handleMessagesRead);
    };
  }, [socket, selectedUser?._id, userData?._id, dispatch]);

  if (!selectedUser) {
    return (
      <div className="hidden lg:flex flex-1 h-[100dvh] bg-[#efeae2] items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-cyan-500 text-transparent bg-clip-text">
            Talko
          </h1>

          <p className="mt-3 text-gray-600 text-lg">
            Select a chat to start messaging.
          </p>

          <div className="mt-8 border-t border-gray-300 pt-4 text-sm text-gray-500">
            Your personal messages are private and secure.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        h-[100dvh] flex-1 bg-[#efeae2] overflow-hidden
        ${selectedUser ? "flex" : "hidden lg:flex"}
        flex-col
      `}
    >
      {/* Header */}
      <div className="shrink-0 h-[72px] sm:h-[78px] bg-[#292b2a] px-3 sm:px-5 flex items-center justify-between shadow-md z-20">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => dispatch(setSelectedUser(null))}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition"
          >
            <IoArrowBack size={25} className="text-white" />
          </button>

          <div className="relative shrink-0">
            <img
              src={selectedUser?.image || "no-image.jpg"}
              alt={selectedUser?.name || selectedUser?.username || "User"}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-green-400"
            />

            {isOnline && (
              <span className="absolute right-0 bottom-0 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-[#292b2a]" />
            )}
          </div>

          <div className="min-w-0">
            <h2 className="text-white font-bold text-lg sm:text-xl capitalize truncate">
              {(
                selectedUser?.name ||
                selectedUser?.username ||
                "user"
              ).toLowerCase()}
            </h2>

            <p
              className={`text-xs sm:text-sm ${
                isOnline ? "text-green-400" : "text-gray-300"
              }`}
            >
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-3 sm:px-6 py-4">
        <div className="space-y-2">
          {messages.length > 0 ? (
            messages.map((msg) => {
              const senderId = msg?.sender?._id || msg?.sender;
              const isMine = String(senderId) === String(userData?._id);

              return isMine ? (
                <SenderMessage
                  key={msg?._id}
                  image={msg?.image}
                  message={msg?.message}
                  time={msg?.createdAt}
                  isRead={msg?.isRead}
                  onImageClick={() => setFullViewImage(msg?.image)}
                />
              ) : (
                <ReceiverMessage
                  key={msg?._id}
                  image={msg?.image}
                  message={msg?.message}
                  time={msg?.createdAt}
                  onImageClick={() => setFullViewImage(msg?.image)}
                />
              );
            })
          ) : (
            <div className="h-full flex items-center justify-center text-center text-gray-500 px-5">
              <div>
                <p className="font-semibold text-lg">No messages yet</p>
                <p className="text-sm mt-1">
                  Send a message and start the conversation.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Preview */}
      {image && (
        <div className="shrink-0 self-start px-3 sm:px-5 py-2 bg-[#efeae2] ">
          <div className="relative inline-block">
            <img
              src={URL.createObjectURL(image)}
              alt="preview"
              className="w-24 h-24 rounded-xl object-cover shadow"
            />

            <button
              type="button"
              onClick={() => setImage(null)}
              className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-sm"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Bottom Input */}
      <form
        onSubmit={handleSendMessage}
        className="shrink-0 bg-gray-100 px-3 sm:px-5 py-3 flex items-center gap-3 border-t border-gray-300"
      >
        <label className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white shadow flex items-center justify-center cursor-pointer shrink-0">
          <IoImageOutline size={25} className="text-gray-700" />
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
        </label>

        <div className="flex-1 bg-white rounded-full shadow px-4 sm:px-5 h-11 sm:h-12 flex items-center">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="w-full outline-none bg-transparent text-sm sm:text-base"
          />
        </div>

        <button
          type="submit"
          disabled={isSending || (!message.trim() && !image)}
          className={`
    w-11 h-11 sm:w-12 sm:h-12 rounded-full shadow 
    flex items-center justify-center shrink-0 transition
    ${
      isSending || (!message.trim() && !image)
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-green-500 hover:bg-green-600 cursor-pointer"
    }
  `}
        >
          {isSending ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <IoSend size={23} className="text-white" />
          )}
        </button>
      </form>
      {fullViewImage && (
        <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center px-4">
          <button
            type="button"
            onClick={() => setFullViewImage(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl flex items-center justify-center transition"
          >
            ×
          </button>

          <img
            src={fullViewImage}
            alt="Full view"
            className="max-w-full max-h-[90dvh] object-contain rounded-xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}

export default ChatContainer;
