import { useState, useEffect } from 'react';
import { getUserPosts } from "@/services/api";
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

const PostsTab = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserPosts();
  }, []);

  const handleEditPost = async (postId) => {
    // Implement edit functionality
  };

  const handleDeletePost = async (postId) => {
    // Implement delete functionality
    return true; // Return true if delete was successful
  };

  const fetchUserPosts = async () => {
    try {
      setIsLoading(true);
      const response = await getUserPosts();
      
      if (response.success) {
        // Make sure we're handling the posts array correctly from the response
        const postsData = response.data?.posts || [];
        setPosts(postsData.map(post => ({
          ...post,
          avatar: post.author?.profilePic || '',
          name: post.author?.username || '',
          timeAgo: post.timestamp || '',
          content: post.content?.text || '',
          images: post.content?.media || [],
          likesCount: post._count?.likes || 0,
          commentsCount: post._count?.comments || 0,
          currentUserId: post.userId,
          id: post.id
        })));
      } else {
        showToast({
          message: "Failed to load posts",
          type: "error"
        });
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
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
          isOwnPost={true}
          onEdit={() => handleEditPost(post.id)}
          onDelete={() => handleDeletePost(post.id)}
        />
      ))}
    </div>
  );
};

export default PostsTab; 