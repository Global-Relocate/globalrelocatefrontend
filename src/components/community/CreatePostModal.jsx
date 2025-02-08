import { useState } from "react";
import { HiPhoto } from "react-icons/hi2";
import { PiVideoFill } from "react-icons/pi";
import { LuUserRound } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";
import PropTypes from 'prop-types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CreatePostModal = ({ isOpen, onClose, userAvatar, onPost }) => {
  const [content, setContent] = useState("");
  const [privacy, setPrivacy] = useState("Anybody can interact");
  const [privacy, setPrivacy] = useState("Anyone");
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  if (!isOpen) return null;

  const privacyOptions = [
    "Anyone",
    "People you follow",
    "Only people you mentioned"
  ];

  const handlePost = () => {
    // Handle post creation here
    console.log("Post content:", content);
    console.log("Privacy setting:", privacy);
    onClose();
    
  const handleImageSelect = (e) => {
    if (selectedVideo) return; // Don't allow images if video is selected
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    // Create preview URLs for the images
    const newPreviewUrls = imageFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    setSelectedImages(prev => [...prev, ...imageFiles]);
  };

  const handleVideoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('video/')) return;

    // Clear any existing images if a video is selected
    selectedImages.forEach((_, index) => handleRemoveImage(index));
    
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
    }

    const videoUrl = URL.createObjectURL(file);
    setVideoPreviewUrl(videoUrl);
    setSelectedVideo(file);
  };

  const handleRemoveVideo = () => {
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
    }
    setVideoPreviewUrl(null);
    setSelectedVideo(null);
  };

  const handleRemoveImage = (index) => {
    URL.revokeObjectURL(previewUrls[index]); // Clean up the URL
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handlePost = async () => {
    if (content.trim() || selectedImages.length > 0 || selectedVideo) {
      let mediaUrls = [];

      if (selectedVideo) {
        // Convert video to base64
        const videoPromise = new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(selectedVideo);
        });
        mediaUrls = [await videoPromise];
      } else if (selectedImages.length > 0) {
        // Convert images to base64 strings
        const imagePromises = selectedImages.map(file => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
          });
        });
        mediaUrls = await Promise.all(imagePromises);
      }

      onPost(content, privacy, mediaUrls, selectedVideo ? 'video' : 'image');
      
      // Clean up
      setContent("");
      setSelectedImages([]);
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      setPreviewUrls([]);
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
        setVideoPreviewUrl(null);
        setSelectedVideo(null);
      }
      onClose();
    }
    
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white rounded-lg w-full max-w-2xl mx-4">
      
        {/* Close button */}
        <div className="absolute right-4 top-4">
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <IoMdClose size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 pt-14">
          <div className="flex gap-3 items-start relative">
            <img src={userAvatar} alt="User avatar" className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write something"
                className="w-[85%] min-h-[200px] p-4 bg-white text-black placeholder-gray-400 text-lg focus:outline-none resize-none border border-white rounded-2xl"
                autoFocus
              />

              {/* Image Previews */}
              {previewUrls.length > 0 && (
                <div className="mt-4 relative">
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative group flex-none">
                        <img 
                          src={url} 
                          alt={`Preview ${index + 1}`} 
                          className="w-48 h-48 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <IoMdClose size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Video Preview */}
              {videoPreviewUrl && (
                <div className="mt-4 relative">
                  <div className="relative group">
                    <video 
                      src={videoPreviewUrl}
                      className="w-full h-[300px] object-cover rounded-lg"
                      controls
                    />
                    <button
                      onClick={handleRemoveVideo}
                      className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <IoMdClose size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={handlePost}
              disabled={!content.trim()}
              className={`absolute right-0 top-0 px-6 py-2 rounded-lg transition-colors ${
                content.trim() ? 'bg-black text-white hover:bg-black/90' : 'bg-[#D4D4D4] text-white'
              disabled={!content.trim() && selectedImages.length === 0 && !selectedVideo}
              className={`absolute right-0 top-0 px-4 py-1 rounded-full ${
                content.trim() || selectedImages.length > 0 || selectedVideo
                  ? "bg-black text-white hover:bg-gray-800" 
                  : "bg-[#D4D4D4] text-white cursor-not-allowed"
              }`}
            >
              Post
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                multiple
                className="hidden"
              />
              <input
                type="file"
                ref={videoInputRef}
                onChange={handleVideoSelect}
                accept="video/*"
                className="hidden"
              />
              <button 
                className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg"
                onClick={() => fileInputRef.current?.click()}
                disabled={!!selectedVideo}
              >
                <HiPhoto 
                  className={selectedVideo ? "text-gray-400" : "text-[#5762D5]"} 
                  size={24} 
                />
                <span className={selectedVideo ? "text-gray-400" : ""}>Photo</span>
              </button>
              <button 
                className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg"
                onClick={() => videoInputRef.current?.click()}
                disabled={selectedImages.length > 0}
              >
                <PiVideoFill 
                  className={selectedImages.length > 0 ? "text-gray-400" : ""} 
                  size={24} 
                />
                <span className={selectedImages.length > 0 ? "text-gray-400" : ""}>Video</span>
              </button>
            </div>
            <div className="border-l border-white pl-4">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg">
                  <LuUserRound size={20} />
                  <span>{privacy}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {privacyOptions.map((option) => (
                    <DropdownMenuItem
                      key={option}
                      onClick={() => setPrivacy(option)}
                      className="cursor-pointer"
                    >
                      {option}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

CreatePostModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  userAvatar: PropTypes.string.isRequired,
  onPost: PropTypes.func.isRequired,
};

export default CreatePostModal; 
