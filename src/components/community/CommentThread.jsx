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

const MAX_VISIBLE_REPLIES = 2;

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
  const [likesCount, setLikesCount] = useState(comment.likesCount || 0);
  const { showUndoToast } = useUndo();
  const [showImagePreview, setShowImagePreview] = useState(false);

  const hasReplies = comment.replies && comment.replies.length > 0;
  const replyCount = comment.replies?.length || 0;

  const handleReply = (replyText, image) => {
    onReply(comment.id, replyText, image);
    setShowReplyInput(false);
  };

  const handleEdit = (newText, image) => {
    onEdit(comment.id, newText, image);
    setShowEditInput(false);
  };

  const handleDelete = () => {
    onDelete(comment.id);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleDropdownClick = () => {
    setIsLoading(true);
    // Simulate loading for 500ms
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const isOwnComment = comment.author === currentUserId;

  if (isDeleted) {
    return null;
  }

  return (
    <div className={`relative ${level > 0 ? 'ml-10' : ''} mb-4`}>
      <div className="flex items-start gap-3">
        <img src={comment.avatar} alt={`${comment.author} avatar`} className="w-8 h-8 rounded-full" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium text-[#5762D5]">{comment.author}</span>
              <span className="text-sm text-gray-500">{comment.timeAgo}</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={handleDropdownClick}>
                <button className="p-1 hover:bg-black/5 rounded-full transition-colors">
                  {isLoading ? (
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
                      onClick={() => setShowEditInput(true)}
                      className="gap-2 py-2.5 px-4 cursor-pointer hover:bg-[#F8F7F7] focus:bg-[#F8F7F7]"
                    >
                      <FiEdit3 size={18} />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={handleDelete}
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
                      <span>Copy link to comment</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="gap-2 py-2.5 px-4 cursor-pointer hover:bg-[#F8F7F7] focus:bg-[#F8F7F7]"
                    >
                      <FiFlag size={18} />
                      <span>Report</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="gap-2 py-2.5 px-4 cursor-pointer hover:bg-[#F8F7F7] focus:bg-[#F8F7F7]"
                    >
                      <IoEyeOffOutline size={18} />
                      <span>I don&apos;t want to see this</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="mt-1">
            <p className="text-gray-800">{comment.content}</p>
            {comment.image && (
              <div 
                className="mt-2 relative w-full max-w-[200px] rounded-lg overflow-hidden cursor-pointer"
                onClick={() => {
                  // Add image preview dialog
                  setShowImagePreview(true);
                }}
              >
                <AspectRatio ratio={16 / 9}>
                  <img 
                    src={comment.image} 
                    alt="Comment attachment" 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AspectRatio>
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
              {likesCount > 0 && (
                <span className="text-sm text-gray-600">{likesCount}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {showImagePreview && comment.image && (
        <Dialog open={showImagePreview} onOpenChange={setShowImagePreview}>
          <DialogContent className="max-w-4xl p-0">
            <img 
              src={comment.image} 
              alt="Comment attachment" 
              className="w-full h-full object-contain"
            />
          </DialogContent>
        </Dialog>
      )}

      {showEditInput ? (
        <div className="mt-3 ml-11">
          <CommentInput 
            userAvatar={currentUserAvatar}
            onSubmit={(text, image) => handleEdit(text, image)}
            autoFocus={true}
            initialValue={comment.content}
            initialImage={comment.image}
            placeholder="Edit your comment..."
          />
        </div>
      ) : null}

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

      {hasReplies && !isExpanded && (
        <button
          className="ml-11 mt-2 text-sm text-[#5762D5] hover:underline"
          onClick={() => setIsExpanded(true)}
        >
          View {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
        </button>
      )}

      {hasReplies && isExpanded && (
        <div className="mt-2">
          {comment.replies.map((reply, index) => (
            <Comment
              key={reply.id}
              comment={reply}
              level={level + 1}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              currentUserAvatar={currentUserAvatar}
              currentUserId={currentUserId}
              isLast={index === comment.replies.length - 1}
            />
          ))}
          <button
            className="ml-11 mt-2 text-sm text-gray-600 hover:text-gray-900"
            onClick={() => setIsExpanded(false)}
          >
            Hide replies
          </button>
        </div>
      )}
    </div>
  );
};

Comment.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    timeAgo: PropTypes.string.isRequired,
    image: PropTypes.string,
    likesCount: PropTypes.number,
    isLikedByUser: PropTypes.bool,
    replies: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  level: PropTypes.number,
  onReply: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  currentUserAvatar: PropTypes.string.isRequired,
  currentUserId: PropTypes.string.isRequired,
  isLast: PropTypes.bool,
};

const CommentThread = ({ comments, currentUserAvatar, currentUserId, onReply, onEdit, onDelete }) => {
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
            currentUserAvatar={currentUserAvatar}
            currentUserId={currentUserId}
            isLast={index === comments.length - 1}
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
      userId: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      timeAgo: PropTypes.string.isRequired,
      image: PropTypes.string,
      likesCount: PropTypes.number,
      isLikedByUser: PropTypes.bool,
      replies: PropTypes.arrayOf(PropTypes.object),
    })
  ).isRequired,
  currentUserAvatar: PropTypes.string.isRequired,
  currentUserId: PropTypes.string.isRequired,
  onReply: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default CommentThread; 