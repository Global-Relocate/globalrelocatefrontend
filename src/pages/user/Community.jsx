import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { HiPhoto } from "react-icons/hi2";
import { PiVideoFill } from "react-icons/pi";
import { LuUserRound } from "react-icons/lu";
import CommunityPostCard from "@/components/community/CommunityPostCard";
import { CommentThreadSkeleton } from "@/components/community/CommentSkeleton";
import CreatePostModal from "@/components/community/CreatePostModal";
import { getUserProfile, getPosts, deletePost } from '@/services/api';
import { Skeleton } from "@/components/ui/skeleton";

function Community() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editPostData, setEditPostData] = useState(null);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [profilePic, setProfilePic] = useState(null);

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

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await getPosts();
      if (response.success && response.data) {
        setPosts(response.data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      try {
        // Fetch user profile to get currentUserId and profile picture
        const userResponse = await getUserProfile();
        if (userResponse.success && userResponse.data) {
          setCurrentUserId(userResponse.data.username);
          setProfilePic(userResponse.data.profilePic); // Store the profile picture
        }
        
        // Fetch posts
        await fetchPosts();
      } catch (error) {
        console.error('Error initializing community:', error);
      }
    };

    fetchUserAndPosts();
  }, []);

  const handlePostCreated = async () => {
    await fetchPosts(); // Refresh posts after creation/edit
    setIsCreatePostModalOpen(false);
  };

  const handlePostDeleted = async (postId) => {
    try {
      const response = await deletePost(postId);
      if (response.success) {
        await fetchPosts(); // Refresh posts after deletion
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleEditPost = (post) => {
    setEditPostData(post);
    setIsCreatePostModalOpen(true);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="w-full flex flex-col">
          <div className="px-4 md:px-8 lg:px-20 pt-2 pb-2">
            <Skeleton className="h-[100px] w-full rounded-2xl" />
          </div>
          <div className="flex-1 px-4 md:px-8 lg:px-20 pb-20 pt-4">
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <CommentThreadSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="w-full flex flex-col">
        {/* Start new post section - Fixed at top */}
        <div className="px-4 md:px-8 lg:px-20 pt-2 pb-2">
          <div 
            className="bg-[#F8F7F7] border border-[#D4D4D4] rounded-2xl p-4 cursor-pointer"
            onClick={() => setIsCreatePostModalOpen(true)}
          >
            {/* Desktop/Tablet View */}
            <div className="hidden sm:flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex text-white items-center justify-center h-10 w-10 rounded-full bg-[#8F8F8F] overflow-hidden">
                  {profilePic ? (
                    <img 
                      src={profilePic} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <LuUserRound className="h-5 w-5" />
                  )}
                </div>
                <span className="text-black">Start a new post</span>
              </div>
              <div className="flex items-center">
                <div className="h-6 w-[1px] bg-[#D4D4D4] mx-4" />
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2">
                    <HiPhoto className="text-[#5762D5]" size={24} />
                    <span>Photo</span>
                  </button>
                  <button className="flex items-center gap-2">
                    <PiVideoFill size={24} />
                    <span>Video</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile View */}
            <div className="flex sm:hidden flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex text-white items-center justify-center h-10 w-10 rounded-full bg-[#8F8F8F] overflow-hidden">
                  {profilePic ? (
                    <img 
                      src={profilePic} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <LuUserRound className="h-5 w-5" />
                  )}
                </div>
                <span className="text-black">Start a new post</span>
              </div>
              <div className="flex items-center justify-center gap-8">
                <button className="flex items-center gap-2">
                  <HiPhoto className="text-[#5762D5]" size={24} />
                  <span>Photo</span>
                </button>
                <button className="flex items-center gap-2">
                  <PiVideoFill size={24} />
                  <span>Video</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 px-4 md:px-8 lg:px-20 pb-20 pt-4">
          {/* Posts feed */}
          <div className="space-y-6">
            {loading ? (
              // Show skeleton loading state
              Array.from({ length: 3 }).map((_, index) => (
                <CommentThreadSkeleton key={index} />
              ))
            ) : (
              posts.map((post) => (
                <CommunityPostCard
                  key={post.id}
                  id={post.id}
                  avatar={post.author.profilePic || '/default-avatar.png'}
                  name={post.author.username}
                  timeAgo={formatTimestamp(post.timestamp)}
                  content={post.content.text}
                  images={post.content.media?.map(m => m.url) || []}
                  likesCount={post._count?.likes || 0}
                  commentsCount={post._count?.comments || 0}
                  currentUserId={currentUserId}
                  isOwnPost={post.author.username === currentUserId}
                  onEdit={() => handleEditPost(post)}
                  onDelete={handlePostDeleted}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => {
          setIsCreatePostModalOpen(false);
          setEditPostData(null);
        }}
        onPostCreated={handlePostCreated}
        editMode={!!editPostData}
        postToEdit={editPostData}
      />
    </DashboardLayout>
  );
}

export default Community;
