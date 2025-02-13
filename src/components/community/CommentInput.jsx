import { useState, useRef, useEffect } from 'react';
import { PiSmiley } from "react-icons/pi";
import { IoImageOutline } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import PropTypes from 'prop-types';
import EmojiPicker from 'emoji-picker-react';
import { AspectRatio } from "@/components/ui/aspect-ratio";

const CommentInput = ({ 
  userAvatar, 
  onSubmit, 
  autoFocus = false, 
  placeholder = "Add a comment",
  initialValue = "" 
}) => {
  const [comment, setComment] = useState(initialValue);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  }, [autoFocus]);

  useEffect(() => {
    if (initialValue && textareaRef.current) {
      textareaRef.current.style.height = '44px';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [initialValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim() || selectedImage) {
      onSubmit(comment, selectedImage);
      setComment('');
      setSelectedImage(null);
      if (textareaRef.current) {
        textareaRef.current.style.height = '44px';
      }
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setSelectedImage(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please select an image file');
      }
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onEmojiClick = (emojiObject) => {
    const cursor = textareaRef.current.selectionStart;
    const text = comment.slice(0, cursor) + emojiObject.emoji + comment.slice(cursor);
    setComment(text);
    setShowEmojiPicker(false);
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
              {selectedImage && (
                <div className="relative p-4">
                  <div className="relative w-full max-w-[200px] rounded-lg overflow-hidden">
                    <AspectRatio ratio={16 / 9}>
                      <img 
                        src={selectedImage} 
                        alt="Selected" 
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </AspectRatio>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                    >
                      <IoClose size={16} />
                    </button>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between px-4 py-2 border-t border-white">
                <div className="flex items-center gap-3">
                  <div className="relative" ref={emojiPickerRef}>
                    <button
                      type="button"
                      className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                      <PiSmiley className="text-gray-600" size={20} />
                    </button>
                    {showEmojiPicker && (
                      <div className="fixed z-50" style={{ bottom: '100px', left: '50%', transform: 'translateX(-50%)' }}>
                        <EmojiPicker
                          onEmojiClick={onEmojiClick}
                          width={300}
                          height={400}
                        />
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <IoImageOutline className="text-gray-600" size={20} />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!comment.trim() && !selectedImage}
                  className={`px-4 py-1 text-sm font-medium rounded-full transition-colors ${
                    comment.trim() || selectedImage
                      ? 'bg-[#5762D5] text-white hover:bg-[#4751C4]' 
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {initialValue ? 'Save' : 'Post'}
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
  placeholder: PropTypes.string,
  initialValue: PropTypes.string
};

export default CommentInput; 
