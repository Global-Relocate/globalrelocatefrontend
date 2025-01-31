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

  const getCursorPosition = (element) => {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(element);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    return preCaretRange.toString().length;
  };

  const setCursorPosition = (element, position) => {
    const range = document.createRange();
    const sel = window.getSelection();
    let currentPos = 0;
    let targetNode = null;
    let targetOffset = position;

    const traverse = (node) => {
      if (targetNode) return;

      if (node.nodeType === Node.TEXT_NODE) {
        const length = node.textContent.length;
        if (currentPos + length >= position) {
          targetNode = node;
          targetOffset = position - currentPos;
        } else {
          currentPos += length;
        }
      } else {
        for (const childNode of node.childNodes) {
          traverse(childNode);
        }
      }
    };

    traverse(element);

    if (targetNode) {
      range.setStart(targetNode, targetOffset);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  const handleInput = (e) => {
    const cursorPosition = getCursorPosition(e.target);
    const text = e.target.textContent;
    setContent(text);

    // Format the content while preserving spaces
    const parts = text.split(/((?<=\s)|(?=\s))/);
    const formattedContent = parts.map(part => {
      if (part.startsWith('#')) {
        return `<span style="color: #208BFE">${part}</span>`;
      }
      return part;
    }).join('');

    // Update content and restore cursor
    e.target.innerHTML = formattedContent;
    setCursorPosition(e.target, cursorPosition);
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
                className="w-full min-h-[150px] focus:outline-none text-lg text-black empty:before:content-[attr(placeholder)] empty:before:text-gray-400 whitespace-pre-wrap"
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
