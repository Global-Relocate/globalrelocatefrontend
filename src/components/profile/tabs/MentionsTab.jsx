import NotificationCard from '../NotificationCard';
import { useNotifications } from '@/context/NotificationsContext';
import { useEffect, useState } from 'react';
import image1 from "@/assets/images/image1.png";
import bellicon from "../../../assets/svg/bell.svg";

const MentionsTab = () => {
  const [mentionNotifications, setMentionNotifications] = useState([]);
  const { markAsRead, deleteNotification, showLessLikeThis } = useNotifications();

  useEffect(() => {
    // Initialize with sample mention notifications
    setMentionNotifications([
      {
        id: '1',
        type: 'system',
        data: {
          content: (
            <p className="text-gray-800">
              <span className="font-medium text-[#5762D5]">Jerry Lamp</span> mentioned you in a post: "Hey @user, check out this amazing travel guide!"
            </p>
          ),
          timeAgo: '2 min ago',
          mentioner: {
            name: 'Jerry Lamp',
            avatar: image1
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
              <span className="font-medium text-[#5762D5]">Jerry Lamp</span> mentioned you in a comment: "Thanks @user for the recommendation!"
            </p>
          ),
          timeAgo: '5 min ago',
          mentioner: {
            name: 'Jerry Lamp',
            avatar: image1
          }
        }
      }
    ]);
  }, []);

  const handleDelete = (id) => {
    setMentionNotifications(prev => prev.filter(notification => notification.id !== id));
    deleteNotification(id);
  };

  if (mentionNotifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[45vh]">
        <img
          src={bellicon}
          alt="Bell Icon"
          className="mb-4"
          style={{ width: '36px', height: '36px', filter: 'invert(41%) sepia(0%) saturate(0%) hue-rotate(180deg) brightness(91%) contrast(88%)' }}
        />
        <p className="text-gray-600">You don&apos;t have any mention notifications yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F8F7F7] rounded-2xl">
      {mentionNotifications.map((notification, index) => (
        <NotificationCard
          key={notification.id}
          id={notification.id}
          type={notification.type}
          data={notification.data}
          isLast={index === mentionNotifications.length - 1}
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

export default MentionsTab; 