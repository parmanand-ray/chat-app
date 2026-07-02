import React from "react";

const SenderMessage = ({image, message}) => {
  return (
    <div className="  w-fit max-w-[500px] bg-cyan-800 px-[20px] py-[10px] text-white text-[17px] rounded-tr-none rounded-2xl relative right-0 ml-auto flex flex-col gap-[10px] mb-1">
       {image &&  <img src={image} alt="" className="w-[150px] rounded-lg"/>}
     {message && <span> {message} </span>}
    </div>
  );
};

export default SenderMessage;
