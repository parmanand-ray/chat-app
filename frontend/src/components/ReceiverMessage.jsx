import React, { useEffect, useRef } from "react";

const ReceiverMessage = ({ image, message, time, onImageClick }) => {
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
        relative mr-auto mb-2 w-fit
        min-w-[70px] max-w-[82%] sm:max-w-[70%] md:max-w-[60%]
        bg-[#2c3a37] text-white
        px-3 py-2 rounded-xl rounded-tl-sm
        flex flex-col gap-1 shadow-md
      "
    >
      {/* Bubble Tail */}
      <span className="absolute -left-2 top-0 w-0 h-0 border-t-[10px] border-t-[#2c3a37] border-l-[10px] border-l-transparent" />

      {image && (
        <img
          src={image}
          alt="received"
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

      {/* Time */}
      <div className="flex items-center justify-end gap-1 text-[10px] sm:text-[11px] text-gray-300 leading-none mt-1">
        <span>{formatTime(time)}</span>
      </div>
    </div>
  );
};

export default ReceiverMessage;
