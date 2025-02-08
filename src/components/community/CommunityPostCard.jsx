import { useState } from 'react';
import favoriteIcon from "../../assets/svg/favorite.svg";
import heartIcon from "../../assets/svg/heart.svg";
import { BsThreeDots } from "react-icons/bs";
import { BiBookmark, BiLink } from "react-icons/bi";
import { FiFlag } from "react-icons/fi";
import { IoEyeOffOutline } from "react-icons/io5";
import { Loader2 } from "lucide-react";
import { PiChatCircle } from "react-icons/pi";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useBookmarks } from "@/context/BookmarkContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import PropTypes from 'prop-types';
import CommentInput from './CommentInput';
import VideoPlayer from './VideoPlayer';
import CommentThread from './CommentThread';
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { FiEdit3 } from "react-icons/fi";
import { HiOutlineTrash } from "react-icons/hi";

const ImageGrid = ({ images }) => {
  const [showCarousel, setShowCarousel] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const displayImages = images.slice(0, 4);
  const remainingImages = images.length > 4 ? images.length - 4 : 0;

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setShowCarousel(true);
  };

  const getGridLayout = () => {
    switch (displayImages.length) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-2";
      case 3:
        return "grid-cols-2";
      case 4:
        return "grid-cols-2";
      default:
        return "grid-cols-1";
    }
  };

  if (showCarousel) {
    return (
      <div 
        className="relative w-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          onClick={() => setShowCarousel(false)}
          className="absolute top-4 right-4 z-20 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70"
        >
          ✕
        </button>
        <Carousel className="w-full" opts={{ startIndex: selectedImageIndex }}>
          <CarouselContent>
            {images.map((media, index) => (
              <CarouselItem key={index}>
                <AspectRatio ratio={16 / 9}>
                  <img
                    src={media}
                    alt={`Post media ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </AspectRatio>
              </CarouselItem>
            ))}
          </CarouselContent>
          {isHovered && (
            <>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </>
          )}
        </Carousel>
      </div>
    );
  }

  return (
    <div className={`grid ${getGridLayout()} gap-3`}>
      {displayImages.length === 1 && (
        <div 
          className="relative w-full rounded-2xl overflow-hidden cursor-pointer"
          onClick={() => handleImageClick(0)}
        >
          <AspectRatio ratio={16 / 9}>
            <img 
              src={displayImages[0]} 
              alt="Post image" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AspectRatio>
        </div>
      )}

      {displayImages.length === 2 && displayImages.map((image, index) => (
        <div 
          key={index} 
          className="relative w-full rounded-2xl overflow-hidden cursor-pointer"
          onClick={() => handleImageClick(index)}
        >
          <AspectRatio ratio={4 / 3}>
            <img 
              src={image} 
              alt={`Post image ${index + 1}`} 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AspectRatio>
        </div>
      ))}

      {displayImages.length === 3 && (
        <>
          <div 
            className="col-span-2 relative w-full rounded-2xl overflow-hidden cursor-pointer"
            onClick={() => handleImageClick(0)}
          >
            <AspectRatio ratio={16 / 9}>
              <img 
                src={displayImages[0]} 
                alt="Post image 1" 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AspectRatio>
          </div>
          {displayImages.slice(1).map((image, index) => (
            <div 
              key={index} 
              className="relative w-full rounded-2xl overflow-hidden cursor-pointer"
              onClick={() => handleImageClick(index + 1)}
            >
              <AspectRatio ratio={4 / 3}>
                <img 
                  src={image} 
                  alt={`Post image ${index + 2}`} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AspectRatio>
            </div>
          ))}
        </>
      )}

      {displayImages.length === 4 && (
        <>
          {displayImages.map((image, index) => (
            <div 
              key={index} 
              className="relative w-full rounded-2xl overflow-hidden cursor-pointer"
              onClick={() => handleImageClick(index)}
            >
              <AspectRatio ratio={1}>
                <img 
                  src={image} 
                  alt={`Post image ${index + 1}`} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {index === 3 && remainingImages > 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white text-lg font-medium">+{remainingImages}</span>
                  </div>
                )}
              </AspectRatio>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

ImageGrid.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string)
};

const VideoContent = ({ videoUrl }) => {
  return (
    <div className="w-full mb-4">
      <VideoPlayer videoUrl={videoUrl} />
    </div>
  );
};

VideoContent.propTypes = {
  videoUrl: PropTypes.string.isRequired,
};

const CommunityPostCard = ({ 
  avatar, 
  name, 
  timeAgo, 
  content, 
  images,
  mediaType = 'image',
  likesImage, 
  likesCount: initialLikesCount, 
  commentsCount: initialCommentsCount,
  comments = [],
  currentUserId
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [localComments, setLocalComments] = useState(comments);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [commentsCount, setCommentsCount] = useState(initialCommentsCount);
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const post = { 
    id: Date.now().toString(),
    avatar, 
    name, 
    timeAgo, 
    content, 
    images, 
    mediaType,
    likesImage, 
    likesCount: initialLikesCount, 
    commentsCount: initialCommentsCount 
  };
  const bookmarked = isBookmarked(post);
  const [isDropdownLoading, setIsDropdownLoading] = useState(false);

  const isOwnPost = currentUserId === name;

  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
    setLikesCount(prevCount => isLiked ? prevCount - 1 : prevCount + 1);
  };

  const handleCommentSubmit = (comment) => {
    const newComment = {
      id: Date.now().toString(),
      author: name,
      avatar: avatar,
      content: comment,
      timeAgo: 'Just now',
      replies: []
    };
    setLocalComments(prev => [...prev, newComment]);
    setCommentsCount(prevCount => prevCount + 1);
    setShowCommentInput(false);
  };

  const handleReply = (parentId, replyText) => {
    const newReply = {
      id: Date.now().toString(),
      author: name,
      avatar: avatar,
      content: replyText,
      timeAgo: 'Just now',
      replies: []
    };

    const updateReplies = (comments) => {
      return comments.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply]
          };
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: updateReplies(comment.replies)
          };
        }
        return comment;
      });
    };

    setLocalComments(updateReplies(localComments));
    setCommentsCount(prevCount => prevCount + 1);
  };

  const handleCommentEdit = (commentId, newContent) => {
    const updateComments = (comments) => {
      return comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            content: newContent
          };
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: updateComments(comment.replies)
          };
        }
        return comment;
      });
    };

    setLocalComments(updateComments(localComments));
  };

  const handleCommentDelete = (commentId) => {
    const deleteFromComments = (comments) => {
      return comments.filter(comment => {
        if (comment.id === commentId) {
          setCommentsCount(prevCount => prevCount - 1);
          return false;
        }
        if (comment.replies) {
          comment.replies = deleteFromComments(comment.replies);
        }
        return true;
      });
    };

    setLocalComments(deleteFromComments(localComments));
  };

  const handleDropdownClick = () => {
    setIsDropdownLoading(true);
    // Simulate loading for 500ms
    setTimeout(() => {
      setIsDropdownLoading(false);
    }, 500);
  };

  const handleBookmarkToggle = () => {
    toggleBookmark(post);
  };

  const renderMedia = () => {
    if (!images || images.length === 0) return null;

    if (mediaType === 'video') {
      return <VideoContent videoUrl={images[0]} />;
    }

    return <ImageGrid images={images} />;
  };

  return (
    <TooltipProvider>
      <div className="w-full bg-[#F8F7F7] border border-[#D4D4D4] rounded-2xl mb-6">
        <div className="px-6 pt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img src={avatar} alt="User avatar" className="w-10 h-10 rounded-full" />
              <div>
                <h3 className="font-medium text-gray-900">{name}</h3>
                <p className="text-sm text-gray-500">Posted {timeAgo}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Tooltip>
                <TooltipTrigger>
                  {bookmarked ? (
                    <FaBookmark 
                      className="text-[#5762D5] cursor-pointer" 
                      size={20} 
                      onClick={handleBookmarkToggle}
                    />
                  ) : (
                    <FaRegBookmark 
                      className="text-gray-600 cursor-pointer hover:text-[#5762D5]" 
                      size={20} 
                      onClick={handleBookmarkToggle}
                    />
                  )}
                </TooltipTrigger>
                <TooltipContent className="bg-[#5762D5]">
                  <span>{bookmarked ? 'Remove Bookmark' : 'Bookmark'}</span>
                </TooltipContent>
              </Tooltip>

              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={handleDropdownClick}>
                  <button className="p-1 hover:bg-black/5 rounded-full transition-colors">
                    {isDropdownLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
                    ) : (
                      <BsThreeDots className="text-gray-600" size={20} />
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[240px] py-2">
                  {isOwnPost ? (
                    <>
                      <DropdownMenuItem 
                        className="gap-2 py-2.5 px-4 cursor-pointer hover:bg-[#F8F7F7] focus:bg-[#F8F7F7]"
                      >
                        <FiEdit3 size={18} />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600 gap-2 py-2.5 px-4 cursor-pointer hover:bg-[#F8F7F7] focus:bg-[#F8F7F7]"
                      >
                        <HiOutlineTrash size={18} />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem 
                        className="gap-2 py-2.5 px-4 cursor-pointer hover:bg-[#F8F7F7] focus:bg-[#F8F7F7]"
                      >
                        <BiLink size={18} />
                        <span>Copy link to post</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="gap-2 py-2.5 px-4 cursor-pointer hover:bg-[#F8F7F7] focus:bg-[#F8F7F7]"
                      >
                        <IoEyeOffOutline size={18} />
                        <span>I don&apos;t want to see this</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="gap-2 py-2.5 px-4 cursor-pointer hover:bg-[#F8F7F7] focus:bg-[#F8F7F7]"
                      >
                        <FiFlag size={18} />
                        <span>Report post</span>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-gray-800">{content}</p>
          </div>
        </div>

        <div className="px-6">
          {renderMedia()}
        </div>

        <div className="px-6 pt-3 pb-4">
          <div className="border-t border-[#D4D4D4] pt-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <img src={likesImage} alt="Likes" className="h-6" />
                  <span className="text-sm text-gray-600">{likesCount} likes</span>
                </div>
                <span className="text-sm text-gray-600">{commentsCount} comments</span>
              </div>
              <div className="flex items-center gap-4">
                <Tooltip>
                  <TooltipTrigger>
                    <div 
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={() => setShowCommentInput(!showCommentInput)}
                    >
                      <PiChatCircle 
                        size={20} 
                        className={`${showCommentInput ? 'text-[#5762D5]' : 'text-gray-600 hover:text-[#5762D5]'}`} 
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-[#5762D5]">
                    <span>Comment</span>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger>
                    <img 
                      src={isLiked ? heartIcon : favoriteIcon} 
                      alt="Like" 
                      className="w-5 h-5 cursor-pointer hover:text-[#5762D5]"
                      onClick={handleLikeToggle}
                    />
                  </TooltipTrigger>
                  <TooltipContent className="bg-[#5762D5]">
                    <span>Like</span>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>

        {showCommentInput && (
          <CommentInput 
            userAvatar={avatar}
            onSubmit={handleCommentSubmit}
            autoFocus={true}
          />
        )}

        {localComments.length > 0 && (
          <CommentThread
            comments={localComments}
            currentUserAvatar={avatar}
            currentUserId={name}
            onAddComment={handleCommentSubmit}
            onReply={handleReply}
            onEdit={handleCommentEdit}
            onDelete={handleCommentDelete}
          />
        )}
      </div>
    </TooltipProvider>
  );
};

CommunityPostCard.propTypes = {
  avatar: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  timeAgo: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  images: PropTypes.arrayOf(PropTypes.string),
  mediaType: PropTypes.oneOf(['image', 'video']),
  likesImage: PropTypes.string.isRequired,
  likesCount: PropTypes.number.isRequired,
  commentsCount: PropTypes.number.isRequired,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      timeAgo: PropTypes.string.isRequired,
      replies: PropTypes.arrayOf(PropTypes.object),
    })
  ),
  currentUserId: PropTypes.string.isRequired,
};

export default CommunityPostCard;
