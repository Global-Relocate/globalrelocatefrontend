import { ArrowUp } from "lucide-react";
import React, { useEffect } from "react";
import { useState } from "react";
import { BiPlus } from "react-icons/bi";
import { MdMic } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";

export default function AiChatInput() {
  const [prompt, setPrompt] = useState("");
  const initPrompt = useLocation()?.state;
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/user/ai-assistant", { state: { prompt } });
  };

  console.log(initPrompt);
  useEffect(() => {
    if (initPrompt && !prompt) {
      setPrompt(initPrompt.prompt);
    }
  }, []);

  return (
    <div className=" left-2 md:left-64 right-0 fixed bottom-3 md:bottom-7 z-50 flex items-center justify-center ">
      <form
        onSubmit={handleSubmit}
        className="px-4 py-3 rounded-[100px] shadow-md flex items-center gap-2 justify-center w-[700px] bg-white"
      >
        <div className="w-full flex items-center pr-2 bg-[#F6F6F6] border border-gray-600 rounded-3xl">
          <input
            type="text"
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
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
