import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { BsPlayFill, BsPauseFill } from 'react-icons/bs';

const VideoPlayer = ({ videoUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleLoadedData = () => {
    setIsLoaded(true);
  };

  return (
    <div 
      className="relative w-full bg-black rounded-2xl overflow-hidden"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full"
        controls={showControls}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onLoadedData={handleLoadedData}
        playsInline
      />
      {!showControls && isLoaded && (
        <button
          onClick={handlePlayPause}
          className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors"
        >
          {isPlaying ? (
            <BsPauseFill className="text-white" size={48} />
          ) : (
            <BsPlayFill className="text-white" size={48} />
          )}
        </button>
      )}
    </div>
  );
};

VideoPlayer.propTypes = {
  videoUrl: PropTypes.string.isRequired,
};

export default VideoPlayer; 
