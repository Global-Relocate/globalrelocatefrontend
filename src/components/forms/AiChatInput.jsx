import { ArrowUp } from "lucide-react";
import React from "react";
import { BiPlus } from "react-icons/bi";
import { MdMic } from "react-icons/md";

export default function AiChatInput() {
  return (
    <div className=" left-2 md:left-64 right-0 fixed bottom-3 md:bottom-7 z-50 flex items-center justify-center ">
      <form className="px-4 py-3 rounded-[100px] shadow-md flex items-center gap-2 justify-center w-[700px] bg-white">
        <div className="w-full flex items-center pr-2 bg-[#F6F6F6] border border-gray-600 rounded-3xl">
          <input
            type="text"
            placeholder="Ask Ai Anything..."
            className=" w-full h-full px-4 py-3 rounded-3xl bg-[#F6F6F6] focus:outline-none text-sm"
            required
          />
          <BiPlus className="text-2xl ml-1" />
          <MdMic className="text-2xl mx-1" />
        </div>
        <button type="submit" className="bg-black text-white rounded-full p-1">
          <ArrowUp />
        </button>
      </form>
    </div>
  );
}