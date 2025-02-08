import PropTypes from 'prop-types';
import bellActiveIcon from "../../assets/svg/filledbell.svg";
import filledfavoriteIcon from "../../assets/svg/filledfavorite.svg";
import { BsThreeDots } from "react-icons/bs";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { RiDeleteBinLine } from "react-icons/ri";
import { GrDislike } from "react-icons/gr";
import { FaRedoAlt } from "react-icons/fa";
import { IoCheckmarkCircle } from "react-icons/io5";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const NotificationCard = ({ 
  type, 
  data, 
  isLast, 
  isUnread = false, 
  isFirst = false,
  onMarkAsRead,
  onDelete,
  onShowLess,
  id 
}) => {
  const [showUndoMessage, setShowUndoMessage] = useState(false);
  const [showFeedbackMessage, setShowFeedbackMessage] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isHoveredFeedback, setIsHoveredFeedback] = useState(false);

  const handleMarkAsRead = () => {
    onMarkAsRead(id);
  };

  const handleDelete = () => {
    setIsDeleted(true);
    setShowUndoMessage(true);
    setTimeout(() => {
      if (!showUndoMessage) {
        onDelete(id);
      }
    }, 5000); // 5 second delay before actual deletion
  };

  const handleUndo = () => {
    setIsDeleted(false);
    setShowUndoMessage(false);
  };

  const handleShowLess = () => {
    setShowFeedbackMessage(true);
    onShowLess(id);
    setTimeout(() => {
      if (!showFeedbackMessage) {
        // Handle any cleanup if needed
      }
    }, 5000);
  };

  const handleUndoFeedback = () => {
    setShowFeedbackMessage(false);
  };

  if (showUndoMessage) {
    return (
      <div className="w-full bg-white p-4 flex justify-between items-center">
        <span>Notification deleted.</span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleUndo}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="flex items-center gap-2 text-black hover:text-black"
        >
          <span>Undo</span>
          <FaRedoAlt 
            className={`transition-transform duration-200 ${isHovered ? 'rotate-180' : ''}`} 
            size={14} 
          />
        </Button>
      </div>
    );
  }

  if (showFeedbackMessage) {
    return (
      <div className="w-full bg-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <IoCheckmarkCircle className="text-[#22C55E]" size={20} />
          <span className="text-[#22C55E]">Thanks. Your feedback helps us improve your notifications.</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleUndoFeedback}
          onMouseEnter={() => setIsHoveredFeedback(true)}
          onMouseLeave={() => setIsHoveredFeedback(false)}
          className="flex items-center gap-2 text-black hover:text-black"
        >
          <span>Undo</span>
          <FaRedoAlt 
            className={`transition-transform duration-200 ${isHoveredFeedback ? 'rotate-180' : ''}`} 
            size={14} 
          />
        </Button>
      </div>
    );
  }

  if (isDeleted) {
    return null;
  }

  const renderNotificationContent = () => {
    const dropdownMenu = (
      <div className="flex flex-col items-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 hover:bg-black/10 rounded-full transition-colors">
              <BsThreeDots className="text-gray-600" size={20} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[240px] py-2">
            {isUnread && (
              <>
                <DropdownMenuItem 
                  onClick={handleMarkAsRead}
                  className="gap-2 py-2.5 px-4 cursor-pointer hover:bg-[#F8F7F7] focus:bg-[#F8F7F7]"
                >
                  <IoMdCheckmarkCircleOutline size={18} />
                  <span>Mark as read</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#D4D4D4]" />
              </>
            )}
            <DropdownMenuItem 
              onClick={handleDelete}
              className="gap-2 py-2.5 px-4 cursor-pointer hover:bg-[#F8F7F7] focus:bg-[#F8F7F7]"
            >
              <RiDeleteBinLine size={24} />
              <span>Delete notification</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleShowLess}
              className="gap-2 py-2.5 px-4 cursor-pointer hover:bg-[#F8F7F7] focus:bg-[#F8F7F7]"
            >
              <GrDislike size={16} />
              <span>Show less like this</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <span className="text-sm text-gray-500 mt-1">{data.timeAgo}</span>
      </div>
    );

    switch (type) {
      case 'system':
        return (
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-[#2563EB] flex items-center justify-center">
                <img src={bellActiveIcon} alt="Bell" className="w-5 h-5 invert" />
              </div>
              {isUnread && (
                <div className="absolute -top-1 -right-1">
                  <div className="w-3 h-3 bg-[#2563EB] rounded-full">
                    <div className="absolute inset-0 bg-[#2563EB] rounded-full animate-ping" />
                  </div>
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-gray-800">{data.content}</p>
            </div>
            {dropdownMenu}
          </div>
        );

      case 'like':
        return (
          <div className="flex items-start gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={filledfavoriteIcon} alt="Heart" className="w-6 h-6" style={{ filter: 'invert(23%) sepia(92%) saturate(6022%) hue-rotate(353deg) brightness(95%) contrast(128%)' }} />
                {isUnread && (
                  <div className="absolute -top-1 -right-1">
                    <div className="w-3 h-3 bg-[#2563EB] rounded-full">
                      <div className="absolute inset-0 bg-[#2563EB] rounded-full animate-ping" />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex -space-x-2">
                {data.likers.slice(0, 3).map((liker, index) => (
                  <img 
                    key={index}
                    src={liker.avatar} 
                    alt={`${liker.name} avatar`} 
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                ))}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-gray-800">
                <span className="font-medium text-[#5762D5]">{data.likers[0].name}</span>
                {data.likers.length > 1 && ` and ${data.likers.length - 1} others`} liked your post
              </p>
              {data.post && (
                <div className="mt-3 p-4 bg-white rounded-xl border border-[#D4D4D4]">
                  <div className="flex gap-4">
                    {data.post.image && (
                      <img 
                        src={data.post.image} 
                        alt="Post" 
                        className="w-32 h-32 rounded-xl object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-gray-800">{data.post.content}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {dropdownMenu}
          </div>
        );

      case 'comment':
        return (
          <div className="flex items-start gap-3">
            <div className="relative">
              <img src={data.commenter.avatar} alt={`${data.commenter.name} avatar`} className="w-10 h-10 rounded-full" />
              {isUnread && (
                <div className="absolute -top-1 -right-1">
                  <div className="w-3 h-3 bg-[#2563EB] rounded-full">
                    <div className="absolute inset-0 bg-[#2563EB] rounded-full animate-ping" />
                  </div>
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-gray-800">
                <span className="font-medium text-[#5762D5]">{data.commenter.name}</span> commented on your post
              </p>
              {data.comment && (
                <div className="mt-3 p-4 bg-white rounded-xl border border-[#D4D4D4]">
                  <p className="text-gray-800">{data.comment}</p>
                </div>
              )}
            </div>
            {dropdownMenu}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      className={`w-full transition-colors cursor-pointer
        ${isUnread 
          ? 'bg-[#D3E8FB] hover:bg-[#C2DFFA]' 
          : 'hover:bg-[#E5E5E5]'
        }
        ${isFirst ? 'rounded-t-2xl' : ''}
        ${isLast ? 'rounded-b-2xl' : ''}
      `}
    >
      <div className="px-6 py-4">
        {renderNotificationContent()}
      </div>
      {!isLast && <div className="w-full h-[1px] bg-[#D4D4D4]" />}
    </div>
  );
};

NotificationCard.propTypes = {
  type: PropTypes.oneOf(['system', 'like', 'comment']).isRequired,
  data: PropTypes.object.isRequired,
  isLast: PropTypes.bool,
  isUnread: PropTypes.bool,
  isFirst: PropTypes.bool,
  onMarkAsRead: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onShowLess: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired
};

export default NotificationCard; 
