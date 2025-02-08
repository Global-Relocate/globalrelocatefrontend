import { useState, useRef, useEffect } from 'react';
import { PiSmiley } from "react-icons/pi";
import { IoImageOutline } from "react-icons/io5";
import PropTypes from 'prop-types';

const CommentInput = ({ userAvatar, onSubmit, autoFocus = false, placeholder = "Add a comment" }) => {
  const [comment, setComment] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      onSubmit(comment);
      setComment('');
      // Reset textarea height to default
      if (textareaRef.current) {
        textareaRef.current.style.height = '44px';
      }
    }
  };

  return (
    <div className="w-full px-6 py-3">
      <div className="flex items-start gap-3">
        <img src={userAvatar} alt="User avatar" className="w-10 h-10 rounded-full" />
        <form onSubmit={handleSubmit} className="flex-1">
          <div className="w-[95%] rounded-2xl border border-white overflow-hidden">
            <div className="w-full rounded-2xl border border-[#D4D4D4] bg-white overflow-hidden">
              <textarea
                ref={textareaRef}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={placeholder}
                rows={1}
                className="w-full px-4 pt-3 pb-2 bg-white resize-none focus:outline-none min-h-[44px]"
                style={{
                  height: '44px',
                  minHeight: '44px',
                  maxHeight: '120px',
                }}
                onInput={(e) => {
                  e.target.style.height = '44px';
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                }}
              />
              <div className="flex items-center justify-between px-4 py-2 border-t border-white">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <PiSmiley className="text-gray-600" size={20} />
                  </button>
                  <button
                    type="button"
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <IoImageOutline className="text-gray-600" size={20} />
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={!comment.trim()}
                  className={`px-4 py-1 text-sm font-medium rounded-full transition-colors ${
                    comment.trim() 
                      ? 'bg-[#5762D5] text-white hover:bg-[#4751C4]' 
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

CommentInput.propTypes = {
  userAvatar: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  autoFocus: PropTypes.bool,
  placeholder: PropTypes.string
};

export default CommentInput; 