import React from "react";

const ReceiverMessage = ({image, message}) => {
  return (
    <div className="w-fit max-w-[500px] bg-black/45 px-[20px] py-[10px] text-white text-[17px] rounded-tl-none rounded-2xl relative left-0  flex flex-col gap-[10px] mb-1">
         {image &&  <img src={image} alt="" className="w-[150px] rounded-lg"/>}
     {message && <span> {message} </span>}
    </div>
  );
};

export default ReceiverMessage;
