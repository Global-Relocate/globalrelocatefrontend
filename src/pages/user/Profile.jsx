import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import FilterButton from "@/components/utils/FilterButton";
import { ArrowLeft, MapPin } from 'lucide-react';
import { LuUserRound } from "react-icons/lu";
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { AuthContext } from "../../context/AuthContext";

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('posts');
  const { user } = useContext(AuthContext);
  
  const displayName = user?.username || user?.name || "User";
  
  const renderContent = () => {
    switch (activeTab) {
      case 'posts':
        return (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">There are no posts yet</h3>
            <p className="text-gray-600">Posts by this member will show up here.</p>
          </div>
        );
      case 'comments':
        return (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">There are no comments yet</h3>
            <p className="text-gray-600">Comments by you will show up here.</p>
          </div>
        );
      case 'bookmarks':
        return (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">No bookmarked posts</h3>
            <p className="text-gray-600">Start bookmarking posts to keep them organized</p>
          </div>
        );
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
        	<div className="bg-gray-50 rounded-lg p-6 mb-8">
					<div className="flex justify-between items-start mb-6">
						<div className="flex items-center gap-4">
							{/* Avatar Section */}
							<div className="relative">
								<div className="h-16 w-16 rounded-full bg-[#8F8F8F] flex items-center justify-center hover:bg-[#7F7F7F] transition-colors">
									<LuUserRound className="h-8 w-8 text-white" />
								</div>
								<div className="absolute -right-1 -bottom-1">
								</div>
							</div>
							<div>
								<h2 className="text-xl font-semibold">{user?.name || "Add name"}</h2>
								<p className="text-gray-600">@{user?.username || "Add username"}</p>
							</div>
						</div>
						<Button variant="outlineBlack" size="md" as={Link} to="/user/edit-profile">
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
        <div className="bg-gray-50 rounded-lg">
          {renderContent()}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;