import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { HiPhoto } from "react-icons/hi2";
import { PiVideoFill } from "react-icons/pi";
import { LuUserRound } from "react-icons/lu";
import CommunityPostCard from "@/components/community/CommunityPostCard";
import { CommentThreadSkeleton } from "@/components/community/CommentSkeleton";
import CreatePostModal from "@/components/community/CreatePostModal";
import image1 from "@/assets/images/image1.png";
import image2 from "@/assets/images/image2.png";
import image3 from "@/assets/images/image3.png";
import image4 from "@/assets/images/image4.png";
import image5 from "@/assets/images/image5.png";
import image6 from "@/assets/images/image6.png";
import image7 from "@/assets/images/image7.png";
import image8 from "@/assets/images/image8.png";
import image9 from "@/assets/images/image9.png";
import image10 from "@/assets/images/image10.png";
import image11 from "@/assets/images/image11.png";
import image12 from "@/assets/images/image12.png";
import image13 from "@/assets/images/image13.png";
import { getUserProfile, getPosts } from '@/services/api';

function Community() {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async () => {
    try {
      const response = await getPosts(page);
      if (response.success) {
        setPosts(prevPosts => 
          page === 1 ? response.data : [...prevPosts, ...response.data]
        );
        setHasMore(page < response.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  useEffect(() => {
    const fetchProfilePic = async () => {
      try {
        const response = await getUserProfile();
        if (response.success && response.data?.profilePic) {
          setProfilePic(response.data.profilePic);
        }
      } catch (error) {
        console.error('Error fetching profile picture:', error);
      }
    };

    fetchProfilePic();
  }, []);

  const handleOpenPostModal = () => {
    setIsPostModalOpen(true);
  };

  const handlePostCreated = () => {
    setPage(1);
    fetchPosts();
  };

  return (
    <DashboardLayout>
      <div className="w-full flex flex-col">
        {/* Start new post section - Fixed at top */}
        <div className="px-4 md:px-8 lg:px-20 pt-2 pb-2">
          <div 
            className="bg-[#F8F7F7] border border-[#D4D4D4] rounded-2xl p-4 cursor-pointer"
            onClick={handleOpenPostModal}
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
                  avatar={post.author.profilePic}
                  name={post.author.username}
                  timeAgo={new Date(post.timestamp).toLocaleDateString()}
                  content={post.content.text}
                  images={post.content.media?.map(m => m.url) || []}
                  likesCount={post.likesCount}
                  commentsCount={post.commentsCount}
                  currentUserId={post.author.id}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <CreatePostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </DashboardLayout>
  );
}

export default Community;
