import NotificationCard from '../NotificationCard';
import image1 from "@/assets/images/image1.png";
import image2 from "@/assets/images/image2.png";
import image3 from "@/assets/images/image3.png";
import image4 from "@/assets/images/image4.png";
import { useNotifications } from '@/context/NotificationsContext';
import { useEffect } from 'react';
import bellicon from "../../../assets/svg/bell.svg";

const AllNotificationsTab = () => {
  const { notifications, setNotifications, markAsRead, deleteNotification, showLessLikeThis } = useNotifications();

  useEffect(() => {
    // Initialize with sample notifications
    if (notifications.length === 0) {
      setNotifications([
        {
          id: '1',
          type: 'system',
          data: {
            content: 'Tax rates in Nigeria have changed',
            timeAgo: '2 min ago'
          },
          isUnread: true
        },
        {
          id: '2',
          type: 'like',
          data: {
            likers: [
              { name: 'Alege Samuel', avatar: image2 },
              { name: 'User 2', avatar: image1 },
              { name: 'User 3', avatar: image3 }
            ],
            timeAgo: '2 min ago',
            post: {
              content: 'My name is Jerry Lamp, i am a traveler and explorer, i am excited about anything related to traveling and would like to connect with liked minded as well on this platform, feel free to say hi.',
            }
          },
          isUnread: true
        },
        {
          id: '3',
          type: 'like',
          data: {
            likers: [
              { name: 'Alege Samuel', avatar: image2 }
            ],
            timeAgo: '2 min ago',
            post: {
              content: 'Hello everyone!',
              image: image4
            }
          }
        },
        {
          id: '4',
          type: 'system',
          data: {
            content: 'Tax rates in Colombia have changed',
            timeAgo: '2 min ago'
          }
        },
        {
          id: '5',
          type: 'comment',
          data: {
            commenter: {
              name: 'Jerry Lamp',
              avatar: image1
            },
            timeAgo: '2 min ago',
            comment: 'My name is Jerry Lamp, i am a traveler and explorer, i am excited about anything related to traveling and would like to connect with liked minded as well on this platform, feel free to say hi.'
          }
        }
      ]);
    }
  }, [notifications.length, setNotifications]);

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[45vh]">
        <img
          src={bellicon}
          alt="Bell Icon"
          className="mb-4"
          style={{ width: '36px', height: '36px', filter: 'invert(41%) sepia(0%) saturate(0%) hue-rotate(180deg) brightness(91%) contrast(88%)' }}
        />
        <p className="text-gray-600">You don&apos;t have any notifications yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F8F7F7] rounded-2xl">
      {notifications.map((notification, index) => (
        <NotificationCard
          key={notification.id}
          id={notification.id}
          type={notification.type}
          data={notification.data}
          isLast={index === notifications.length - 1}
          isFirst={index === 0}
          isUnread={notification.isUnread}
          onMarkAsRead={markAsRead}
          onDelete={deleteNotification}
          onShowLess={showLessLikeThis}
        />
      ))}
    </div>
  );
};

export default AllNotificationsTab; 