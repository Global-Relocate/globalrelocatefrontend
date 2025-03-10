// In SinglePost.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import CommunityPostCard from "@/components/community/CommunityPostCard";
import { CommentThreadSkeleton } from "@/components/community/CommentSkeleton";
import { getSinglePost, getUserProfile } from "@/services/api";
import { showToast } from "@/components/ui/toast";

// Add the formatTimestamp function
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};

function SinglePost() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchPostAndUser = async () => {
      try {
        setLoading(true);
        
        // Fetch user profile
        const userResponse = await getUserProfile();
        if (userResponse.success && userResponse.data) {
          setCurrentUserId(userResponse.data.username);
        }

        // Fetch post details
        const response = await getSinglePost(postId);
        if (response.success && response.data) {
          setPost(response.data);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        showToast({
          message: "Failed to load post",
          type: "error"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndUser();
  }, [postId]);

  const handleEdit = () => {
    // Handle edit functionality if needed
    console.log('Edit post:', post.id);
  };

  const handleDelete = async () => {
    // Handle delete functionality if needed
    console.log('Delete post:', post.id);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="w-full max-w-3xl mx-auto pt-6">
          <CommentThreadSkeleton />
        </div>
      </DashboardLayout>
    );
  }

  if (!post) {
    return (
      <DashboardLayout>
        <div className="w-full max-w-3xl mx-auto pt-6 text-center">
          <p>Post not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="w-full max-w-3xl mx-auto pt-6">
        <CommunityPostCard
          id={post.id}
          avatar={post.author.profilePic || '/default-avatar.png'}
          name={post.author.username}
          timeAgo={formatTimestamp(post.timestamp)}
          content={post.content.text}
          images={post.content.media?.map(m => m.url) || []}
          likesCount={post.stats?.likes || 0} // Updated to use stats
          commentsCount={post.stats?.comments || 0} // Updated to use stats
          currentUserId={currentUserId}
          isOwnPost={post.author.username === currentUserId}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </DashboardLayout>
  );
}

export default SinglePost;