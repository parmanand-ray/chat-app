import React, { useEffect, useRef } from "react";
import { IoCheckmarkOutline, IoCheckmarkDoneOutline } from "react-icons/io5";

const SenderMessage = ({ image, message, time, isRead, onImageClick }) => {
  const scroll = useRef(null);

  const formatTime = (date) => {
    if (!date) return "";

    const messageDate = new Date(date);
    const today = new Date();

    const isToday =
      messageDate.getDate() === today.getDate() &&
      messageDate.getMonth() === today.getMonth() &&
      messageDate.getFullYear() === today.getFullYear();

    const time = messageDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (isToday) {
      return time;
    }

    const formattedDate = messageDate.toLocaleDateString([], {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    return `${formattedDate}, ${time}`;
  };

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [image, message]);

  return (
    <div
      ref={scroll}
      className="
        relative ml-auto mb-2 w-fit
        min-w-[70px] max-w-[82%] sm:max-w-[70%] md:max-w-[60%]
        bg-[#005c4b] text-white
        px-3 py-2 rounded-xl rounded-tr-sm
        flex flex-col gap-1 shadow-md
      "
    >
      {/* Bubble Tail */}
      <span className="absolute -right-2 top-0 w-0 h-0 border-t-[10px] border-t-[#005c4b] border-r-[10px] border-r-transparent" />

      {image && (
        <img
          src={image}
          alt="sent"
          className="
            w-[190px] sm:w-[240px] md:w-[280px]
            max-w-full max-h-[320px]
            rounded-xl object-cover
          "
          onLoad={() => scroll.current?.scrollIntoView({ behavior: "smooth" })}
          onClick={onImageClick}
        />
      )}

      {message && (
        <span className="text-sm sm:text-[15px] leading-[20px] break-words whitespace-pre-wrap pr-10">
          {message}
        </span>
      )}

      {/* Time + Tick */}
      <div className="flex items-center justify-end gap-1 text-[10px] sm:text-[11px] text-gray-300 leading-none mt-1">
        <span>{formatTime(time)}</span>
        <span className="flex items-center gap-0.5 text-[13px] sm:text-sm">
          {isRead ? (
            <IoCheckmarkDoneOutline className="text-green-300" />
          ) : (
            <IoCheckmarkOutline className="text-blue-300" />
          )}
        </span>
      </div>
    </div>
  );
};

export default SenderMessage;
