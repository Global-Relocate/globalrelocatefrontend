import NotificationCard from '../NotificationCard';
import { useNotifications } from '@/context/NotificationsContext';
import { useEffect, useState } from 'react';
import image2 from "@/assets/images/image2.png";
import image3 from "@/assets/images/image3.png";
import bellicon from "../../../assets/svg/bell.svg";

const FollowingTab = () => {
  const [followingNotifications, setFollowingNotifications] = useState([]);
  const { markAsRead, deleteNotification, showLessLikeThis } = useNotifications();

  useEffect(() => {
    // Initialize with sample following notifications
    setFollowingNotifications([
      {
        id: '1',
        type: 'system',
        data: {
          content: (
            <p className="text-gray-800">
              <span className="font-medium text-[#5762D5]">Alege Samuel</span> has started following you
            </p>
          ),
          timeAgo: '2 min ago',
          follower: {
            name: 'Alege Samuel',
            avatar: image2
          }
        },
        isUnread: true
      },
      {
        id: '2',
        type: 'system',
        data: {
          content: (
            <p className="text-gray-800">
              <span className="font-medium text-[#5762D5]">John Doe</span> has started following you
            </p>
          ),
          timeAgo: '5 min ago',
          follower: {
            name: 'John Doe',
            avatar: image3
          }
        }
      }
    ]);
  }, []);

  const handleDelete = (id) => {
    setFollowingNotifications(prev => prev.filter(notification => notification.id !== id));
    deleteNotification(id);
  };

  if (followingNotifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[45vh]">
        <img
          src={bellicon}
          alt="Bell Icon"
          className="mb-4"
          style={{ width: '36px', height: '36px', filter: 'invert(41%) sepia(0%) saturate(0%) hue-rotate(180deg) brightness(91%) contrast(88%)' }}
        />
        <p className="text-gray-600">You don&apos;t have any following notifications yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F8F7F7] rounded-2xl">
      {followingNotifications.map((notification, index) => (
        <NotificationCard
          key={notification.id}
          id={notification.id}
          type={notification.type}
          data={notification.data}
          isLast={index === followingNotifications.length - 1}
          isFirst={index === 0}
          isUnread={notification.isUnread}
          onMarkAsRead={markAsRead}
          onDelete={handleDelete}
          onShowLess={showLessLikeThis}
        />
      ))}
    </div>
  );
};

export default FollowingTab; 