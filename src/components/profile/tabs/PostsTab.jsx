import { useState, useEffect } from 'react';
import { getUserPosts, getUserProfile } from "@/services/api";
import CommunityPostCard from "@/components/community/CommunityPostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { showToast } from "@/components/ui/toast";

const PostSkeleton = () => (
  <div className="bg-[#F8F7F7] border border-[#D4D4D4] rounded-2xl p-6 space-y-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-48 w-full rounded-lg" />
    <div className="flex items-center justify-between pt-4">
      <div className="flex gap-4">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-5 w-5" />
        <Skeleton className="h-5 w-5" />
      </div>
    </div>
  </div>
);

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

const PostsTab = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleEditPost = async (postId) => {
    // Implement edit functionality
  };

  const handleDeletePost = async (postId) => {
    // Implement delete functionality
    return true;
  };

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      // Fetch user profile and posts in parallel
      const [profileResponse, postsResponse] = await Promise.all([
        getUserProfile(),
        getUserPosts()
      ]);

      if (profileResponse.success) {
        setUserProfile(profileResponse.data);
      }

      if (postsResponse.success) {
        const postsData = postsResponse.data?.posts || [];
        setPosts(postsData.map(post => ({
          id: post.id,
          avatar: profileResponse.data?.profilePic || '',
          name: profileResponse.data?.fullName || post.author?.username || 'User',
          timeAgo: formatTimestamp(post.timestamp),
          content: post.content?.text || '',
          images: post.content?.media?.map(media => media.url) || [],
          likesCount: post._count?.likes || 0,
          commentsCount: post._count?.comments || 0,
          currentUserId: post.userId,
          isOwnPost: true,
          mediaType: 'image'
        })));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      showToast({
        message: "Failed to load posts",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 mb-20">
        {[1, 2, 3].map((i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg">
        <h3 className="text-xl font-semibold mb-2">There are no posts yet</h3>
        <p className="text-gray-600">Posts by this member will show up here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-20">
      {posts.map((post) => (
        <CommunityPostCard 
          key={post.id} 
          {...post}
          onEdit={() => handleEditPost(post.id)}
          onDelete={() => handleDeletePost(post.id)}
        />
      ))}
    </div>
  );
};

export default PostsTab; 