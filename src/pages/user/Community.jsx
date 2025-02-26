import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { HiPhoto } from "react-icons/hi2";
import { PiVideoFill } from "react-icons/pi";
import CommunityPostCard from "@/components/community/CommunityPostCard";
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

function Community() {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [posts, setPosts] = useState([
    {
      avatar: image13,
      name: "Leon Francesco",
      timeAgo: "2m ago",
      content: "Rome from every angle - a visual feast of history, culture, and architectural mastery. 🎨 #RomanHoliday #CityViews",
      images: [image12, image11, image10, image9, image8, image7, image6, image5, image4],
      likers: [
        { name: "Jerry Lamp", avatar: image1 },
        { name: "Alege Samuel", avatar: image2 },
        { name: "John Doe", avatar: image3 }
      ],
      likesCount: 6,
      commentsCount: 0,
      comments: []
    },
    {
      avatar: image1,
      name: "Jerry Lamp",
      timeAgo: "5m ago",
      content: "Exploring the eternal city's magnificent landmarks. Each corner tells a story of centuries past. 🇮🇹 #RomanArchitecture #TravelDiary",
      images: [image4, image5],
      likers: [
        { name: "Alege Samuel", avatar: image2 },
        { name: "John Doe", avatar: image3 }
      ],
      likesCount: 8,
      commentsCount: 2,
      comments: []
    },
    {
      avatar: image1,
      name: "Jerry Lamp",
      timeAgo: "10m ago",
      content: "A journey through Rome's architectural wonders. The city's skyline is a testament to human creativity and engineering brilliance. ✨ #RomaViews #Heritage",
      images: [image4, image5, image6],
      likers: [
        { name: "Leon Francesco", avatar: image13 },
        { name: "Alege Samuel", avatar: image2 },
        { name: "John Doe", avatar: image3 }
      ],
      likesCount: 12,
      commentsCount: 4,
      comments: []
    },
    {
      avatar: image1,
      name: "Jerry Lamp",
      timeAgo: "15m ago",
      content: "Step into history at the Colosseum, Rome's iconic amphitheater. Once home to gladiator battles, it stands as a breathtaking symbol of ancient engineering and timeless grandeur. 🇮🇹 ✨ #Colosseum #Rome",
      images: [image4, image5, image6, image7],
      likers: [
        { name: "Leon Francesco", avatar: image13 },
        { name: "Alege Samuel", avatar: image2 }
      ],
      likesCount: 15,
      commentsCount: 6,
      comments: []
    },
    {
      avatar: image2,
      name: "Samuel Alege",
      timeAgo: "22s ago",
      content: "Ever notice how life feels like a mix of a loading bar and a playlist on shuffle? Some days, you're at 2% wondering if you'll ever make it, and other days, you're jamming to the perfect vibe. Just keep hitting play. 🎵💪 #RandomThoughts #KeepGoing",
      likers: [
        { name: "John Doe", avatar: image3 }
      ],
      likesCount: 1,
      commentsCount: 0,
      comments: []
    }
  ]);

  const handleOpenPostModal = () => {
    setIsPostModalOpen(true);
  };

  const handleCreatePost = (content, privacy, images = []) => {
    const newPost = {
      avatar: image1,
      name: "Jerry Lamp",
      timeAgo: "Just now",
      content: content,
      images: images,
      likers: [],
      likesCount: 0,
      commentsCount: 0,
      comments: []
    };

    setPosts(prevPosts => [newPost, ...prevPosts]);
    setIsPostModalOpen(false);
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
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 px-4 md:px-8 lg:px-20 pb-20 pt-4">
          {/* Create Post Modal */}
          <CreatePostModal
            isOpen={isPostModalOpen}
            onClose={() => setIsPostModalOpen(false)}
            userAvatar={image1}
            onPost={handleCreatePost}
          />

          {/* Posts feed */}
          <div className="space-y-6">
            {posts.map((post, index) => (
              <CommunityPostCard key={index} {...post} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Community;
