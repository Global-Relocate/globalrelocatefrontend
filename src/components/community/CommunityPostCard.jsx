import { useState, useEffect } from 'react';
import favoriteIcon from "../../assets/svg/favorite.svg";
import heartIcon from "../../assets/svg/heart.svg";
import { BsThreeDots } from "react-icons/bs";
import { BiLink } from "react-icons/bi";
import { FiFlag } from "react-icons/fi";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { usePosts } from "@/context/PostContext";
import { useComments } from "@/context/CommentContext";
import { showToast } from "@/components/ui/toast";
import { getSinglePost, createComment, getPostComments, replyToComment, getCommentReplies, editComment as editCommentApi, deleteComment as deleteCommentApi, likePost, getPostLikes, likeComment, getCommentLikes } from "@/services/api";
import { CommentThreadSkeleton } from "@/components/community/CommentSkeleton";

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

const StackedAvatars = ({ likers }) => {
  if (!likers?.length) return null;

  return (
    <div className="flex -space-x-2">
      {likers.slice(0, 3).map((liker, index) => (
        <img
          key={index}
          src={liker.avatar}
          alt={`${liker.name} avatar`}
          className="w-6 h-6 rounded-full border-2 border-white"
        />
      ))}
    </div>
  );
};

StackedAvatars.propTypes = {
  likers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export const LikesDialog = ({ isOpen, onClose, likers, className }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className={`w-[calc(100%-2rem)] sm:w-full max-w-md p-6 ${className || ''}`}>
      <DialogHeader>
        <DialogTitle className="text-start">Likes</DialogTitle>
      </DialogHeader>
      <div className="max-h-[60vh] overflow-y-auto">
        {likers.map((liker) => (
          <div key={liker.id} className="flex items-center gap-3 py-2">
            <img 
              src={liker.profilePic} 
              alt={liker.username} 
              className="w-10 h-10 rounded-full" 
            />
            <div className="flex flex-col">
              <span className="font-medium">{liker.username}</span>
              <span className="text-sm text-gray-500">{liker.fullName}</span>
            </div>
          </div>
        ))}
      </div>
    </DialogContent>
  </Dialog>
);

// Helper function to determine like icon
const getLikeIcon = (isLiked) => {
  return isLiked ? heartIcon : favoriteIcon;
};

// Helper function to format count text
const formatCountText = (count, singularText, pluralText) => {
  if (count <= 0) return '';
  return count === 1 ? `1 ${singularText}` : `${count} ${pluralText}`;
};

const CommunityPostCard = ({ 
  avatar, 
  name, 
  timeAgo, 
  content, 
  images,
  mediaType = 'image',
  likers = [],
  likesCount: initialLikesCount, 
  commentsCount: initialCommentsCount,
  currentUserId,
  id,
  isOwnPost,
  onEdit,
  onDelete,
  isLiked: initialIsLiked = false,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [postComments, setPostComments] = useState([]);
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
    likesImage: likers.length > 0 ? likers[0].avatar : '',
    likesCount: initialLikesCount, 
    commentsCount: initialCommentsCount 
  };
  const bookmarked = isBookmarked(post);
  const [isDropdownLoading, setIsDropdownLoading] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addPost, deletePost } = usePosts();
  const { addComment } = useComments();
  const [localPosts, setLocalPosts] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [editImages, setEditImages] = useState(images);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [likersList, setLikersList] = useState([]);
  const [isLiking, setIsLiking] = useState(false);
  const [isLoadingLikes, setIsLoadingLikes] = useState(false);

  useEffect(() => {
    setIsLiked(initialIsLiked);
  }, [initialIsLiked]);

  const checkIfUserLiked = async () => {
    try {
      setIsLoadingLikes(true);
      const response = await getPostLikes(id);
      if (response.success) {
        const userLike = response.data.find(like => like.id === currentUserId);
        
        setIsLiked(!!userLike);
        setLikersList(response.data);
        setLikesCount(response.pagination.total);
      }
    } catch (error) {
      console.error('Error fetching likes:', error);
    } finally {
      setIsLoadingLikes(false);
    }
  };

  useEffect(() => {
    checkIfUserLiked();
  }, [id, currentUserId]);

  const handleLikeToggle = async () => {
    if (isLiking) return;
    
    const previousState = isLiked;
    const previousCount = likesCount;
    
    try {
      setIsLiking(true);
      const response = await likePost(id);
      
      if (response.success) {
        const newLikeState = response.data.action === 'liked';
        setIsLiked(newLikeState);
        setLikesCount(response.data.likeCount);
        
        await checkIfUserLiked();
      }
    } catch (error) {
      setIsLiked(previousState);
      setLikesCount(previousCount);
      console.error('Error toggling like:', error);
      showToast({
        message: "Failed to like/unlike post",
        type: "error"
      });
    } finally {
      setIsLiking(false);
    }
  };

  const handleCommentSubmit = async (text, media) => {
    try {
      if (!text.trim() && !media) return;

      const formData = new FormData();
      if (text.trim()) {
        formData.append('text', text.trim());
      }
      if (media) {
        formData.append('media', media);
      }

      const response = await createComment(id, text, media);
      if (response.success) {
        await fetchComments();
        setShowCommentInput(false);
      }
    } catch (error) {
      console.error('Error creating comment:', error);
      showToast({
        message: "Failed to post comment",
        type: "error"
      });
    }
  };

  const handleReply = async (commentId, text, media) => {
    try {
      const response = await replyToComment(commentId, id, text, media);
      if (response.success) {
        await fetchComments();
      }
    } catch (error) {
      console.error('Error replying to comment:', error);
      showToast({
        message: "Failed to post reply",
        type: "error"
      });
    }
  };

  const handleCommentEdit = async (commentId, text, media) => {
    try {
      const response = await editCommentApi(commentId, text, media);
      if (response.success) {
        await fetchComments();
      }
    } catch (error) {
      console.error('Error editing comment:', error);
      showToast({
        message: "Failed to edit comment",
        type: "error"
      });
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      const response = await deleteCommentApi(commentId);
      if (response.success) {
        await fetchComments();
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      showToast({
        message: "Failed to delete comment",
        type: "error"
      });
    }
  };

  const handleDropdownClick = () => {
    setIsDropdownLoading(true);
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

  const handlePostSubmit = (content, images) => {
    const newPost = {
      avatar: avatar,
      name: name,
      timeAgo: timeAgo,
      content: content,
      images: images,
      likers: [],
      likesCount: 0,
      commentsCount: 0,
      comments: []
    };
    
    addPost(newPost);
    setLocalPosts(prevPosts => [newPost, ...prevPosts]);
    setPostComments(prev => [...prev, newPost]);
    setLikesCount(prev => prev + 1);
    setCommentsCount(prev => prev + 1);
    setShowCommentInput(false);
  };

  const handleEditPost = () => {
    const updatedPost = {
      avatar,
      name,
      timeAgo,
      content: editContent,
      images: editImages,
      likers,
      likesCount,
      commentsCount,
      id
    };
    addPost(updatedPost);
    setIsEditModalOpen(false);
  };

  const handleDeletePost = () => {
    deletePost(id);
    setIsDeleteConfirmOpen(false);
  };

  const handleEditClick = () => {
    onEdit();
  };

  const handleDeleteClick = async () => {
    if (await onDelete(id)) {
      setIsDeleteConfirmOpen(false);
    }
  };

  const handleCopyLink = async (postId) => {
    try {
      const postUrl = `${window.location.origin}/user/community/post/${postId}`;
      
      await navigator.clipboard.writeText(postUrl);
      
      showToast({
        message: "Post link copied to clipboard",
        type: "success"
      });
    } catch (error) {
      console.error('Error copying link:', error);
      showToast({
        message: "Failed to copy link",
        type: "error"
      });
    }
  };

  const fetchComments = async () => {
    try {
      setIsLoadingComments(true);
      const response = await getPostComments(id);
      if (response.success) {
        setPostComments(response.data);
        setCommentsCount(response.pagination.total);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      showToast({
        message: "Failed to load comments",
        type: "error"
      });
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleShowLikes = async () => {
    try {
      const response = await getPostLikes(id);
      if (response.success) {
        setLikersList(response.data);
        setShowLikes(true);
      }
    } catch (error) {
      console.error('Error fetching likes:', error);
      showToast({
        message: "Failed to load likes",
        type: "error"
      });
    }
  };

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments]);

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
                        onClick={handleEditClick}
                        className="gap-2 py-2.5 px-4 cursor-pointer hover:bg-[#F8F7F7] focus:bg-[#F8F7F7]"
                      >
                        <FiEdit3 size={18} />
                        <span>Edit Post</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setIsDeleteConfirmOpen(true)}
                        className="text-red-600 gap-2 py-2.5 px-4 cursor-pointer hover:bg-[#F8F7F7] focus:bg-[#F8F7F7]"
                      >
                        <HiOutlineTrash size={18} />
                        <span>Delete Post</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleCopyLink(id)}
                        className="gap-2 py-2.5 px-4 cursor-pointer hover:bg-[#F8F7F7] focus:bg-[#F8F7F7]"
                      >
                        <BiLink size={18} />
                        <span>Copy link to post</span>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem 
                        onClick={() => handleCopyLink(id)}
                        className="gap-2 py-2.5 px-4 cursor-pointer hover:bg-[#F8F7F7] focus:bg-[#F8F7F7]"
                      >
                        <BiLink size={18} />
                        <span>Copy link to post</span>
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
                  <StackedAvatars likers={likers} />
                  {loading ? (
                    <Skeleton className="h-4 w-20" />
                  ) : (
                    <button 
                      className="text-sm text-gray-600 hover:text-gray-900"
                      onClick={handleShowLikes}
                    >
                      {isLoadingLikes ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        formatCountText(likesCount, 'like', 'likes')
                      )}
                    </button>
                  )}
                  </div>
                <div className="flex items-center gap-3">
                  {loading ? (
                    <Skeleton className="h-4 w-20" />
                  ) : (
                    <button 
                      className="text-sm text-gray-600 hover:text-gray-900"
                      onClick={() => setShowComments(true)}
                    >
                      {formatCountText(commentsCount, 'comment', 'comments')}
                    </button>
                  )}
                </div>
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
                    <button 
                      className="relative"
                      onClick={handleLikeToggle}
                      disabled={isLiking}
                    >
                      <img 
                        src={getLikeIcon(isLiked)}
                        alt={isLiked ? "Unlike" : "Like"}
                        className={`w-5 h-5 cursor-pointer transition-opacity duration-200 ${isLiking ? 'opacity-50' : ''}`}
                        style={isLiked ? {
                          filter: 'invert(23%) sepia(92%) saturate(6022%) hue-rotate(353deg) brightness(95%) contrast(128%)'
                        } : undefined}
                      />
                      {isLiking && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Loader2 className="h-3 w-3 animate-spin" />
                        </div>
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-[#5762D5]">
                    <span>{isLiked ? 'Unlike' : 'Like'}</span>
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

        {showComments && (
          <div>
            {isLoadingComments ? (
              <CommentThreadSkeleton />
            ) : postComments && postComments.length > 0 ? (
          <CommentThread
                comments={postComments}
            currentUserAvatar={avatar}
                currentUserId={currentUserId}
            onAddComment={handleCommentSubmit}
            onReply={handleReply}
            onEdit={handleCommentEdit}
            onDelete={handleCommentDelete}
              />
            ) : (
              <div className="px-6 py-4 text-center text-gray-500">
                No comments yet
              </div>
            )}
          </div>
        )}

        {!showComments && commentsCount > 0 && (
          <button
            className="px-6 py-2 text-sm text-[#5762D5] hover:underline"
            onClick={() => {
              setShowComments(true);
              fetchComments();
            }}
          >
            {commentsCount === 1 
              ? 'View comment' 
              : `View all ${commentsCount} comments`}
          </button>
        )}

        {showLikes && (
          <LikesDialog
            isOpen={showLikes}
            onClose={() => setShowLikes(false)}
            likers={likersList}
            className="rounded-lg"
          />
        )}

        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent>
            <form onSubmit={handleEditPost}>
              <textarea 
                value={editContent} 
                onChange={(e) => setEditContent(e.target.value)} 
                placeholder="Edit your post..."
              />
              <button type="submit">Save Changes</button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
          <DialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[calc(100%-2rem)] sm:w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
            <p className="mb-4">Are you sure you want to delete this post?</p>
            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => setIsDeleteConfirmOpen(false)} 
                className="text-black px-4 py-2"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteClick} 
                className="text-red-600 px-4 py-2"
              >
                Delete
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

CommunityPostCard.propTypes = {
  id: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  timeAgo: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  images: PropTypes.arrayOf(PropTypes.string),
  likesCount: PropTypes.number.isRequired,
  commentsCount: PropTypes.number.isRequired,
  currentUserId: PropTypes.string.isRequired,
  isOwnPost: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isLiked: PropTypes.bool,
};

export default CommunityPostCard;
