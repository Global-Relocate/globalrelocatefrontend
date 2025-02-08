import { useState } from 'react';
import PropTypes from 'prop-types';
import { BsThreeDots } from "react-icons/bs";
import { FiEdit3, FiFlag } from "react-icons/fi";
import { HiOutlineTrash } from "react-icons/hi";
import { BiLink } from "react-icons/bi";
import { IoEyeOffOutline } from "react-icons/io5";
import { Loader2 } from "lucide-react";
import CommentInput from './CommentInput';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MAX_VISIBLE_REPLIES = 2;

const Comment = ({ comment, level = 0, onReply, currentUserAvatar, currentUserId }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showAllReplies, setShowAllReplies] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleReply = (replyText) => {
    onReply(comment.id, replyText);
    setShowReplyInput(false);
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

  const isOwnComment = comment.userId === currentUserId;

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
              <DropdownMenuContent align="end" className="w-[200px]">
                {isOwnComment ? (
                  <>
                    <DropdownMenuItem className="gap-2">
                      <FiEdit3 className="h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600 gap-2">
                      <HiOutlineTrash className="h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem className="gap-2">
                      <BiLink className="h-4 w-4" />
                      Copy link to comment
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <FiFlag className="h-4 w-4" />
                      Report
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <IoEyeOffOutline className="h-4 w-4" />
                      I don&apos;t want to see this
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-gray-800 mt-1">{comment.content}</p>
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
          {/* Single L-shaped connector for all replies */}
          <div 
            className="absolute left-4 top-2 h-full w-[2px] bg-[#E5E7EB]"
            style={{ marginLeft: '-1px' }}
          />
          <div 
            className="absolute left-4 top-2 w-[24px] h-[2px] bg-[#E5E7EB]"
            style={{ marginLeft: '-1px' }}
          />

          {/* Show "See previous replies" button if needed */}
          {!showAllReplies && hiddenRepliesCount > 0 && (
            <button
              className="ml-12 mb-3 text-sm text-[#5762D5] hover:underline"
              onClick={() => setShowAllReplies(true)}
            >
              See {hiddenRepliesCount} previous {hiddenRepliesCount === 1 ? 'reply' : 'replies'}
            </button>
          )}

          {/* Replies container */}
          <div className="space-y-4">
            {visibleReplies?.map((reply) => (
              <Comment
                key={reply.id}
                comment={reply}
                level={1}
                onReply={onReply}
                currentUserAvatar={currentUserAvatar}
                currentUserId={currentUserId}
              />
            ))}
          </div>

          {/* Show "Collapse replies" button if expanded */}
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
  currentUserAvatar: PropTypes.string.isRequired,
  currentUserId: PropTypes.string.isRequired,
};

const CommentThread = ({ comments, currentUserAvatar, currentUserId, onReply }) => {
  return (
    <div className="w-full px-6 pb-4">
      <div className="pt-2">
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            onReply={onReply}
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
};

export default CommentThread; 