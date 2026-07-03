import React from "react";
import { useEffect } from "react";
import { useRef } from "react";

const SenderMessage = ({ image, message, time }) => {
  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  let scroll = useRef();
  useEffect(() => {
    scroll.current.scrollIntoView({ behavior: "smooth" });
  }, [image, message]);
  return (
    <div
      ref={scroll}
      className="relative ml-auto mb-2 min-w-[8%] max-w-[75%] w-fit bg-[#005c4b] text-white px-3 py-1 rounded-xl rounded-tr-sm flex flex-col gap-2 shadow-md"
    >
      {/* Bubble Tail */}
      <span className="absolute -right-2 top-0 w-0 h-0 border-t-[10px] border-t-[#005c4b] border-r-[10px] border-r-transparent"></span>

      {image && (
        <img
          src={image}
          alt=""
          className="w-[180px] max-w-full rounded-xl object-cover"
          onLoad={() => scroll.current?.scrollIntoView({ behavior: "smooth" })}
        />
      )}

      {message && (
        <span className="text-[15px] leading-[20px] break-words pr-3 mb-0">
          {message}
        </span>
      )}

      {/* Time + Tick */}
      <div className="flex items-center mb-1 justify-end gap-1 text-[11px] text-gray-300 leading-[4px]">
        <span>{formatTime(time)}</span>
        <span className="text-blue-300">✓✓</span>
      </div>
    </div>
  );
};

export default SenderMessage;
