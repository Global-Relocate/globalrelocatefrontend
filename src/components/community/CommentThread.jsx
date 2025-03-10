import { useState } from 'react';
import PropTypes from 'prop-types';
import { BsThreeDots } from "react-icons/bs";
import { FiEdit3, FiFlag } from "react-icons/fi";
import { HiOutlineTrash } from "react-icons/hi";
import { BiLink } from "react-icons/bi";
import { IoEyeOffOutline } from "react-icons/io5";
import { Loader2 } from "lucide-react";
// import { FaRedoAlt } from "react-icons/fa";
// import { Button } from "@/components/ui/button";
import CommentInput from './CommentInput';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useUndo } from "@/context/UndoContext";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { showToast } from "@/components/ui/toast";
import { getCommentReplies, getSinglePost } from '@/services/api';

const MAX_VISIBLE_REPLIES = 2;

const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  // If the date is invalid, return empty string
  if (isNaN(date.getTime())) return '';

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
};

const Comment = ({ 
  comment, 
  level = 0, 
  onReply, 
  onEdit, 
  onDelete, 
  currentUserAvatar, 
  currentUserId,
  isLast = false
}) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showEditInput, setShowEditInput] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isLiked, setIsLiked] = useState(comment.isLikedByUser || false);
  const [currentLikesCount, setCurrentLikesCount] = useState(comment.likesCount || 0);
  const { showUndoToast } = useUndo();
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  const [localReplies, setLocalReplies] = useState([]);
  const [isDropdownLoading, setIsDropdownLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const {
    id,
    author,
    content,
    createdAt,
    _count,
    postId,
    userId,
  } = comment;

  const totalReplies = _count?.replies || 0;
  const totalLikes = _count?.likes || 0;

  const handleReply = (replyText, image) => {
    onReply(id, replyText, image);
    setShowReplyInput(false);
  };

  const handleEditComment = () => {
    onEdit(id, editContent);
    setShowEditInput(false);
  };

  const handleDeleteComment = () => {
    onDelete(id);
    setIsDeleteConfirmOpen(false);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setCurrentLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleDropdownClick = () => {
    setIsLoading(true);
    // Simulate loading for 500ms
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const isOwnComment = userId === currentUserId;

  const handleViewReplies = async () => {
    if (isExpanded) {
      setIsExpanded(false);
      setLocalReplies([]);
      return;
    }

    try {
      setIsLoadingReplies(true);
      const response = await getCommentReplies(postId, id);
      if (response.success) {
        setLocalReplies(response.data.replies || []);
        setIsExpanded(true);
      }
    } catch (error) {
      console.error('Error fetching replies:', error);
      showToast({
        message: "Failed to load replies",
        type: "error"
      });
    } finally {
      setIsLoadingReplies(false);
    }
  };

  const handleCopyCommentLink = async () => {
    try {
      // Get the post details first
      const response = await getSinglePost(postId);
      if (response.success) {
        // Construct the comment URL
        const commentUrl = `${window.location.origin}/user/community/post/${postId}#comment-${id}`;
        await navigator.clipboard.writeText(commentUrl);
        showToast({
          message: "Comment link copied to clipboard",
          type: "success"
        });
      }
    } catch (error) {
      console.error('Error copying comment link:', error);
      showToast({
        message: "Failed to copy comment link",
        type: "error"
      });
    }
    setShowDropdown(false);
  };

  const handleReportComment = () => {
    showToast({
      message: "Comment has been reported",
      type: "success"
    });
    setShowDropdown(false);
  };

  if (isDeleted) {
    return null;
  }

  return (
    <div className={`relative ${level > 0 ? 'ml-10' : ''} mb-4`}>
      <div className="flex items-start gap-3">
        <img 
          src={author.profilePic} 
          alt={`${author.username} avatar`} 
          className="w-8 h-8 rounded-full" 
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium text-[#5762D5]">{author.username}</span>
              <span className="text-sm text-gray-500">
                {formatTimestamp(createdAt)}
              </span>
            </div>
            <DropdownMenu open={showDropdown} onOpenChange={setShowDropdown}>
              <DropdownMenuTrigger asChild>
                <button 
                  className="p-1 hover:bg-black/5 rounded-full transition-colors"
                  onClick={() => setIsDropdownLoading(true)}
                >
                  {isDropdownLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
                  ) : (
                    <BsThreeDots className="text-gray-600" size={16} />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[240px] py-2">
                {isOwnComment ? (
                  <>
                    <DropdownMenuItem 
                      onClick={() => {
                        onEdit(id, content.text);
                        setShowDropdown(false);
                      }}
                      className="gap-2 py-2.5 px-4 cursor-pointer hover:bg-[#F8F7F7] focus:bg-[#F8F7F7]"
                    >
                      <FiEdit3 size={18} />
                      <span>Edit Comment</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => {
                        onDelete(id);
                        setShowDropdown(false);
                      }}
                      className="text-red-600 gap-2 py-2.5 px-4 cursor-pointer hover:bg-[#F8F7F7] focus:bg-[#F8F7F7]"
                    >
                      <HiOutlineTrash size={18} />
                      <span>Delete Comment</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem 
                      onClick={handleCopyCommentLink}
                      className="gap-2 py-2.5 px-4 cursor-pointer hover:bg-[#F8F7F7] focus:bg-[#F8F7F7]"
                    >
                      <BiLink size={18} />
                      <span>Copy link to comment</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={handleReportComment}
                      className="gap-2 py-2.5 px-4 cursor-pointer hover:bg-[#F8F7F7] focus:bg-[#F8F7F7]"
                    >
                      <FiFlag size={18} />
                      <span>Report</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="mt-1">
            {showEditInput ? (
              <div className="mt-2">
                <CommentInput 
                  userAvatar={currentUserAvatar}
                  onSubmit={handleEditComment}
                  autoFocus={true}
                  initialValue={editContent}
                  placeholder="Edit your comment"
                />
              </div>
            ) : (
              <p className="text-gray-800">{content.text}</p>
            )}
            {content.media && content.media.length > 0 && (
              <div className="mt-2 relative w-full max-w-[200px] rounded-lg overflow-hidden">
                <img 
                  src={content.media[0]} 
                  alt="Comment attachment" 
                  className="w-full h-auto"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 mt-2">
            <button 
              className="text-sm text-gray-600 hover:text-gray-900"
              onClick={() => setShowReplyInput(!showReplyInput)}
            >
              Reply
            </button>
            <div className="flex items-center gap-1">
              <button
                onClick={handleLike}
                className="flex items-center"
              >
                {isLiked ? (
                  <img 
                    src="/src/assets/svg/filledfavorite.svg" 
                    alt="Liked" 
                    className="w-4 h-4"
                    style={{ filter: 'invert(23%) sepia(92%) saturate(6022%) hue-rotate(353deg) brightness(95%) contrast(128%)' }}
                  />
                ) : (
                  <img 
                    src="/src/assets/svg/favorite.svg" 
                    alt="Like" 
                    className="w-4 h-4"
                  />
                )}
              </button>
              {currentLikesCount > 0 && (
                <span className="text-sm text-gray-600">{currentLikesCount}</span>
              )}
            </div>
          </div>

          {/* Delete Confirmation Dialog */}
          <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
            <DialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[calc(100%-2rem)] sm:w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
              <p className="mb-4">Are you sure you want to delete this comment?</p>
              <div className="flex justify-end space-x-2">
                <button 
                  onClick={() => setIsDeleteConfirmOpen(false)} 
                  className="text-black px-4 py-2"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteComment} 
                  className="text-red-600 px-4 py-2"
                >
                  Delete
                </button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Show replies button */}
          {totalReplies > 0 && !isExpanded && (
            <button
              className="ml-11 mt-2 text-sm text-[#5762D5] hover:underline flex items-center gap-2"
              onClick={handleViewReplies}
            >
              {isLoadingReplies ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading replies...</span>
                </>
              ) : (
                <span>View {totalReplies} {totalReplies === 1 ? 'reply' : 'replies'}</span>
              )}
            </button>
          )}

          {/* Display replies */}
          {isExpanded && localReplies.length > 0 && (
            <div className="mt-2">
              {localReplies.map((reply) => (
                <Comment
                  key={reply.id}
                  comment={{
                    ...reply,
                    postId,
                  }}
                  level={level + 1}
                  onReply={onReply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  currentUserAvatar={currentUserAvatar}
                  currentUserId={currentUserId}
                  isLast={false}
                />
              ))}
              <button
                className="ml-11 mt-2 text-sm text-gray-600 hover:text-gray-900"
                onClick={() => {
                  setIsExpanded(false);
                  setLocalReplies([]);
                }}
              >
                Hide replies
              </button>
            </div>
          )}
        </div>
      </div>

      {showImagePreview && content.media && content.media.length > 0 && (
        <Dialog open={showImagePreview} onOpenChange={setShowImagePreview}>
          <DialogContent className="max-w-4xl p-0">
            <img 
              src={content.media[0]} 
              alt="Comment attachment" 
              className="w-full h-full object-contain"
            />
          </DialogContent>
        </Dialog>
      )}

      {showReplyInput && (
        <div className="mt-3 ml-11">
          <CommentInput 
            userAvatar={currentUserAvatar}
            onSubmit={handleReply}
            autoFocus={true}
            placeholder="Write a reply..."
          />
        </div>
      )}
    </div>
  );
};

Comment.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    postId: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    author: PropTypes.shape({
      id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      profilePic: PropTypes.string
    }).isRequired,
    content: PropTypes.shape({
      text: PropTypes.string,
      media: PropTypes.arrayOf(PropTypes.string)
    }).isRequired,
    createdAt: PropTypes.string.isRequired,
    _count: PropTypes.shape({
      replies: PropTypes.number,
      likes: PropTypes.number
    }),
    replies: PropTypes.array
  }).isRequired,
  level: PropTypes.number,
  onReply: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  currentUserAvatar: PropTypes.string.isRequired,
  currentUserId: PropTypes.string.isRequired,
  isLast: PropTypes.bool
};

const CommentThread = ({ comments, currentUserAvatar, currentUserId, onReply, onEdit, onDelete }) => {
  const [expandedComments, setExpandedComments] = useState(new Set());

  const handleViewReplies = async (commentId) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      newSet.add(commentId);
      return newSet;
    });
  };

  return (
    <div className="w-full px-6 pb-4">
      <div className="pt-2">
        {comments.map((comment, index) => (
          <Comment
            key={comment.id}
            comment={comment}
            onReply={onReply}
            onEdit={onEdit}
            onDelete={onDelete}
            onViewReplies={handleViewReplies}
            currentUserAvatar={currentUserAvatar}
            currentUserId={currentUserId}
            isExpanded={expandedComments.has(comment.id)}
            isLast={index === comments.length - 1}
            level={0}
          />
        ))}
      </div>
    </div>
  );
};

CommentThread.propTypes = {
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      author: PropTypes.shape({
        id: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        profilePic: PropTypes.string
      }).isRequired,
      content: PropTypes.shape({
        text: PropTypes.string,
        media: PropTypes.arrayOf(PropTypes.string)
      }).isRequired,
      createdAt: PropTypes.string.isRequired,
      _count: PropTypes.shape({
        replies: PropTypes.number,
        likes: PropTypes.number
      })
    })
  ).isRequired,
  currentUserAvatar: PropTypes.string.isRequired,
  currentUserId: PropTypes.string.isRequired,
  onReply: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default CommentThread; 