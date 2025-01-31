import { useState, useRef } from "react";
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
  const editorRef = useRef(null);

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

  const handleInput = (e) => {
    const text = e.target.textContent;
    setContent(text);

    // Get the current cursor position
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const cursorPosition = range.startOffset;

    // Split text into words and format
    const words = text.split(/\s+/);
    const formattedContent = words.map(word => {
      if (word.startsWith('#')) {
        return `<span style="color: #208BFE">${word}</span>`;
      }
      return word;
    }).join(' ');

    // Update the content
    e.target.innerHTML = formattedContent;

    // Restore cursor position
    if (editorRef.current) {
      const newRange = document.createRange();
      const sel = window.getSelection();
      
      // Find the correct text node and position
      let currentNode = editorRef.current.firstChild;
      let currentPos = 0;
      
      while (currentNode) {
        if (currentNode.nodeType === Node.TEXT_NODE) {
          if (currentPos + currentNode.length >= cursorPosition) {
            newRange.setStart(currentNode, cursorPosition - currentPos);
            newRange.collapse(true);
            sel.removeAllRanges();
            sel.addRange(newRange);
            break;
          }
          currentPos += currentNode.length;
        } else if (currentNode.nodeType === Node.ELEMENT_NODE) {
          if (currentNode.textContent && currentPos + currentNode.textContent.length >= cursorPosition) {
            const textNode = currentNode.firstChild;
            newRange.setStart(textNode, cursorPosition - currentPos);
            newRange.collapse(true);
            sel.removeAllRanges();
            sel.addRange(newRange);
            break;
          }
          currentPos += currentNode.textContent ? currentNode.textContent.length : 0;
        }
        currentNode = currentNode.nextSibling;
      }
    }
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
          <div className="flex gap-3 items-start">
            <img src={userAvatar} alt="User avatar" className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <div
                ref={editorRef}
                contentEditable
                role="textbox"
                aria-multiline="true"
                placeholder="Write something"
                className="w-full min-h-[150px] focus:outline-none text-lg text-black empty:before:content-[attr(placeholder)] empty:before:text-gray-400"
                onInput={handleInput}
              />
            </div>
            <button
              onClick={handlePost}
              disabled={!content.trim()}
              className={`px-4 py-1 rounded-full ${
                content.trim() 
                  ? "bg-black text-white hover:bg-gray-800" 
                  : "bg-[#D4D4D4] text-white cursor-not-allowed"
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
