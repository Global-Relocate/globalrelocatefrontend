// Profile.jsx
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import FilterButton from "@/components/utils/FilterButton";
import { ArrowLeft, MapPin } from 'lucide-react';
import { LuUserRound } from "react-icons/lu";
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { AuthContext } from "../../context/AuthContext";
import AccountSettings from './AccountSettings';
import PostsTab from '@/components/profile/tabs/PostsTab';
import CommentsTab from '@/components/profile/tabs/CommentsTab';
import BookmarksTab from '@/components/profile/tabs/BookmarksTab';

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('posts');
  const { user } = useContext(AuthContext);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'posts':
        return <PostsTab />;
      case 'comments':
        return <CommentsTab />;
      case 'bookmarks':
        return <BookmarksTab />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 py-6">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-semibold">Profile</h1>
        </div>
        
        {/* Profile Card */}
        <div className="bg-[#F8F7F7] rounded-2xl p-6 mb-8 border border-[#D4D4D4]">
          <div className="flex justify-between items-start mb-6">
            <div className="flex flex-col items-start gap-4">
              {/* Avatar Section */}
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-[#8F8F8F] flex items-center justify-center hover:bg-[#7F7F7F] transition-colors">
                  <LuUserRound className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold">{user?.name || "Add name"}</h2>
                <p className="text-gray-600">@{user?.username || "Add username"}</p>
              </div>
            </div>
            <Button variant="outlineBlack" size="md" onClick={() => setIsSettingsOpen(true)}>
              Edit profile
            </Button>
          </div>
          <p className="mb-4">
            I am a travel explorer touring the world and meeting new people.
          </p>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>Paris, France.</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <FilterButton
            title="Posts"
            isActive={activeTab === 'posts'}
            onClick={() => setActiveTab('posts')}
          />
          <FilterButton
            title="Comments"
            isActive={activeTab === 'comments'}
            onClick={() => setActiveTab('comments')}
          />
          <FilterButton
            title="Bookmarks"
            isActive={activeTab === 'bookmarks'}
            onClick={() => setActiveTab('bookmarks')}
          />
        </div>

        {/* Content */}
        {renderContent()}

        {/* Account Settings Modal */}
        <AccountSettings open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
      </div>
    </DashboardLayout>
  );
};

export default Profile;
