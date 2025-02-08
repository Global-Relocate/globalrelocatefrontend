import { useState } from "react";
import { HiPhoto } from "react-icons/hi2";
import { PiVideoFill } from "react-icons/pi";
import { LuUserRound } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";
import PropTypes from 'prop-types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CreatePostModal = ({ isOpen, onClose, userAvatar }) => {
  const [content, setContent] = useState("");
  const [privacy, setPrivacy] = useState("Anybody can interact");

  if (!isOpen) return null;

  const privacyOptions = [
    "Anyone",
    "People you follow",
    "Only people you mentioned"
  ];

  const handlePost = () => {
    // Handle post creation here
    console.log("Post content:", content);
    console.log("Privacy setting:", privacy);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white rounded-lg w-full max-w-2xl mx-4">
      
        {/* Close button */}
        <div className="absolute right-4 top-4">
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <IoMdClose size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 pt-14">
          <div className="flex gap-3 items-start relative">
            <img src={userAvatar} alt="User avatar" className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write something"
                className="w-[85%] min-h-[200px] p-4 bg-white text-black placeholder-gray-400 text-lg focus:outline-none resize-none border border-white rounded-2xl"
                autoFocus
              />
            </div>
            <button
              onClick={handlePost}
              disabled={!content.trim()}
              className={`absolute right-0 top-0 px-6 py-2 rounded-lg transition-colors ${
                content.trim() ? 'bg-black text-white hover:bg-black/90' : 'bg-[#D4D4D4] text-white'
              }`}
            >
              Post
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg">
                <HiPhoto className="text-[#5762D5]" size={24} />
                <span>Photo</span>
              </button>
              <button className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg">
                <PiVideoFill size={24} />
                <span>Video</span>
              </button>
            </div>
            <div className="border-l border-white pl-4">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg">
                  <LuUserRound size={20} />
                  <span>{privacy}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {privacyOptions.map((option) => (
                    <DropdownMenuItem
                      key={option}
                      onClick={() => setPrivacy(option)}
                      className="cursor-pointer"
                    >
                      {option}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

CreatePostModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  userAvatar: PropTypes.string.isRequired,
};

export default CreatePostModal; 
