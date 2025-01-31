import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { HiPhoto } from "react-icons/hi2";
import { PiVideoFill } from "react-icons/pi";
import CommunityPostCard from "@/components/community/CommunityPostCard";
import CreatePostModal from "@/components/community/CreatePostModal";
import image1 from "@/assets/images/image1.png";
import image2 from "@/assets/images/image2.png";
import image3 from "@/assets/images/image3.png";
import imageStacked from "@/assets/images/stackedimage.png";

function Community() {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const posts = [
    {
      avatar: image1,
      name: "Jerry Lamp",
      timeAgo: "2m ago",
      content: "Hello everyone! My name is Jerry Lamp, i am a traveler and explorer, i am excited about anything related to traveling and would like to connect with liked minded as well on this platform, feel free to say hi.",
      likesImage: imageStacked,
      likesCount: 6,
      commentsCount: 0
    },
    {
      avatar: image2,
      name: "Samuel Alege",
      timeAgo: "22s ago",
      content: "Ever notice how life feels like a mix of a loading bar and a playlist on shuffle? Some days, you're at 2% wondering if you'll ever make it, and other days, you're jamming to the perfect vibe. Just keep hitting play. 🎵💪 #RandomThoughts #KeepGoing",
      likesImage: image3,
      likesCount: 1,
      commentsCount: 0
    }
  ];

  const handleOpenPostModal = () => {
    setIsPostModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="w-full flex flex-col gap-6 px-4 md:px-8 lg:px-20 pb-20">
        {/* Start new post section */}
        <div 
          className="sticky top-0 bg-[#F8F7F7] border border-[#D4D4D4] rounded-lg p-4 cursor-pointer"
          onClick={handleOpenPostModal}
        >
          {/* Desktop/Tablet View */}
          <div className="hidden sm:flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={image1} alt="User avatar" className="w-10 h-10 rounded-full" />
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
              <img src={image1} alt="User avatar" className="w-10 h-10 rounded-full" />
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

        {/* Create Post Modal */}
        <CreatePostModal
          isOpen={isPostModalOpen}
          onClose={() => setIsPostModalOpen(false)}
          userAvatar={image1}
        />

        {/* Posts feed */}
        <div className="space-y-6">
          {posts.map((post, index) => (
            <CommunityPostCard key={index} {...post} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Community;
