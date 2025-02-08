import { useState } from 'react';
import PropTypes from 'prop-types';
import { BsThreeDots } from "react-icons/bs";
import { FiEdit3, FiFlag } from "react-icons/fi";
import { HiOutlineTrash } from "react-icons/hi";
import { BiLink } from "react-icons/bi";
import { IoEyeOffOutline } from "react-icons/io5";
import { Loader2 } from "lucide-react";
import { FaRedoAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import CommentInput from './CommentInput';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MAX_VISIBLE_REPLIES = 2;

const Comment = ({ comment, level = 0, onReply, onEdit, onDelete, currentUserAvatar, currentUserId }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showEditInput, setShowEditInput] = useState(false);
  const [showAllReplies, setShowAllReplies] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [showUndoMessage, setShowUndoMessage] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleReply = (replyText) => {
    onReply(comment.id, replyText);
    setShowReplyInput(false);
  };

  const handleEdit = (newText) => {
    onEdit(comment.id, newText);
    setShowEditInput(false);
  };

  const handleDelete = () => {
    setIsDeleted(true);
    setShowUndoMessage(true);
    setTimeout(() => {
      if (!showUndoMessage) {
        onDelete(comment.id);
      }
    }, 5000); // 5 second delay before actual deletion
  };

  const handleUndo = () => {
    setIsDeleted(false);
    setShowUndoMessage(false);
  };

  const handleDropdownClick = () => {
    setIsLoading(true);
    // Simulate loading for 500ms
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const visibleReplies = showAllReplies 
    ? comment.replies 
    : comment.replies?.slice(-MAX_VISIBLE_REPLIES);

  const hiddenRepliesCount = comment.replies?.length - MAX_VISIBLE_REPLIES;

  const isOwnComment = comment.author === currentUserId;

  if (showUndoMessage) {
    return (
      <div className="w-full bg-white p-4 flex justify-between items-center">
        <span>Comment deleted.</span>
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

  if (isDeleted) {
    return null;
  }

  return (
    <div className={`relative ${level > 0 ? 'ml-12' : ''} mb-4`}>
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
          {showEditInput ? (
            <div className="mt-2">
              <CommentInput 
                userAvatar={currentUserAvatar}
                onSubmit={handleEdit}
                autoFocus={true}
                initialValue={comment.content}
                placeholder="Edit your comment"
              />
            </div>
          ) : (
            <p className="text-gray-800 mt-1">{comment.content}</p>
          )}
          <div className="flex items-center gap-6 mt-2">
            <button 
              className="text-sm text-gray-600 hover:text-gray-900"
              onClick={() => setShowReplyInput(!showReplyInput)}
            >
              Reply
            </button>
            <button className="text-sm text-gray-600 hover:text-gray-900">
              Like
            </button>
          </div>
        </div>
      </div>

      {showReplyInput && (
        <div className="mt-3">
          <CommentInput 
            userAvatar={currentUserAvatar}
            onSubmit={handleReply}
            autoFocus={true}
            placeholder="Add a reply"
          />
        </div>
      )}

      {comment.replies?.length > 0 && (
        <div className="relative mt-2">
          <div 
            className="absolute left-4 top-2 h-full w-[2px] bg-[#E5E7EB]"
            style={{ marginLeft: '-1px' }}
          />
          <div 
            className="absolute left-4 top-2 w-[24px] h-[2px] bg-[#E5E7EB]"
            style={{ marginLeft: '-1px' }}
          />

          {!showAllReplies && hiddenRepliesCount > 0 && (
            <button
              className="ml-12 mb-3 text-sm text-[#5762D5] hover:underline"
              onClick={() => setShowAllReplies(true)}
            >
              See {hiddenRepliesCount} previous {hiddenRepliesCount === 1 ? 'reply' : 'replies'}
            </button>
          )}

          <div className="space-y-4">
            {visibleReplies?.map((reply) => (
              <Comment
                key={reply.id}
                comment={reply}
                level={1}
                onReply={onReply}
                onEdit={onEdit}
                onDelete={onDelete}
                currentUserAvatar={currentUserAvatar}
                currentUserId={currentUserId}
              />
            ))}
          </div>

          {showAllReplies && comment.replies?.length > MAX_VISIBLE_REPLIES && (
            <button
              className="ml-12 mt-3 text-sm text-gray-600 hover:text-gray-900"
              onClick={() => setShowAllReplies(false)}
            >
              Collapse replies
            </button>
          )}
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
    replies: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  level: PropTypes.number,
  onReply: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  currentUserAvatar: PropTypes.string.isRequired,
  currentUserId: PropTypes.string.isRequired,
};

const CommentThread = ({ comments, currentUserAvatar, currentUserId, onReply, onEdit, onDelete }) => {
  return (
    <div className="w-full px-6 pb-4">
      <div className="pt-2">
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            onReply={onReply}
            onEdit={onEdit}
            onDelete={onDelete}
            currentUserAvatar={currentUserAvatar}
            currentUserId={currentUserId}
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
