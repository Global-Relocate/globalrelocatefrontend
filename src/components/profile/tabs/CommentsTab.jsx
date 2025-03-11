import { useState, useEffect } from 'react';
import { getUserComments, getUserProfile } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { showToast } from "@/components/ui/toast";

// Define formatTimestamp function directly in the component
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

const CommentSkeleton = () => (
  <div className="bg-[#F8F7F7] border border-[#D4D4D4] rounded-2xl p-4 space-y-3">
    <div className="flex items-center gap-3">
      <Skeleton className="w-8 h-8 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
    <Skeleton className="h-4 w-full" />
  </div>
);

const CommentCard = ({ comment, userProfile }) => {
  return (
    <div className="bg-[#F8F7F7] border border-[#D4D4D4] rounded-2xl p-4">
      <div className="flex items-center gap-3 mb-2">
        <img 
          src={userProfile?.profilePic} 
          alt={userProfile?.username} 
          className="w-8 h-8 rounded-full"
        />
        <div>
          <h4 className="font-medium">{userProfile?.fullName || userProfile?.username}</h4>
          <p className="text-sm text-gray-500">{formatTimestamp(comment.createdAt)}</p>
        </div>
      </div>
      <p className="text-gray-800">{comment.content.text}</p>
      {comment.content.media && comment.content.media.length > 0 && (
        <div className="mt-2">
          <img 
            src={comment.content.media[0].url} 
            alt="Comment attachment" 
            className="max-h-32 rounded-lg"
          />
        </div>
      )}
      {comment.post && (
        <div className="mt-2 text-sm text-gray-500">
          <span>On post: {comment.post.content?.text || 'Deleted post'}</span>
        </div>
      )}
    </div>
  );
};

const CommentsTab = () => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      // Fetch user profile and comments in parallel
      const [profileResponse, commentsResponse] = await Promise.all([
        getUserProfile(),
        getUserComments()
      ]);

      if (profileResponse.success) {
        setUserProfile(profileResponse.data);
      }

      if (commentsResponse.success) {
        // Extract comments from the response data
        const userComments = commentsResponse.data?.comments || [];
        setComments(userComments);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      showToast({
        message: "Failed to load comments",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <CommentSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg">
        <h3 className="text-xl font-semibold mb-2">No comments yet</h3>
        <p className="text-gray-600">Your comments on posts will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-20">
      {comments.map((comment) => (
        <CommentCard 
          key={comment.id} 
          comment={comment}
          userProfile={userProfile}
        />
      ))}
    </div>
  );
};

export default CommentsTab; 