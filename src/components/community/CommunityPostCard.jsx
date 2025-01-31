import React from 'react';
import favoriteIcon from "../../assets/svg/favorite.svg";
import heartIcon from "../../assets/svg/heart.svg";
import { FaRegBookmark, FaBookmark } from "react-icons/fa6";
import { BsThreeDots } from "react-icons/bs";
import { PiChatCircle } from "react-icons/pi";
import { useState } from 'react';

const CommunityPostCard = ({ 
  avatar, 
  name, 
  timeAgo, 
  content, 
  likesImage, 
  likesCount, 
  commentsCount 
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <div className="w-full bg-[#F8F7F7] border border-[#D4D4D4] rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img src={avatar} alt="User avatar" className="w-10 h-10 rounded-full" />
          <div>
            <h3 className="font-medium text-gray-900">{name}</h3>
            <p className="text-sm text-gray-500">Posted {timeAgo}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {isBookmarked ? (
            <FaBookmark 
              className="text-black cursor-pointer" 
              size={20} 
              onClick={() => setIsBookmarked(false)}
            />
          ) : (
            <FaRegBookmark 
              className="text-gray-600 cursor-pointer" 
              size={20} 
              onClick={() => setIsBookmarked(true)}
            />
          )}
          <BsThreeDots className="text-gray-600 cursor-pointer" size={20} />
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-800">{content}</p>
      </div>

      <div className="border-t border-[#D4D4D4] pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img src={likesImage} alt="Likes" className="h-6" />
              <span className="text-sm text-gray-600">{likesCount} likes</span>
            </div>
            <span className="text-sm text-gray-600">{commentsCount} comments</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 cursor-pointer">
              <PiChatCircle size={20} className="text-gray-600" />
            </div>
            <img 
              src={isLiked ? heartIcon : favoriteIcon} 
              alt="Like" 
              className="w-5 h-5 cursor-pointer"
              onClick={() => setIsLiked(!isLiked)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPostCard; 