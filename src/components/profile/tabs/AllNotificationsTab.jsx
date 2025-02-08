import NotificationCard from '../NotificationCard';
import image1 from "@/assets/images/image1.png";
import image2 from "@/assets/images/image2.png";
import image3 from "@/assets/images/image3.png";
import image4 from "@/assets/images/image4.png";
import { useNotifications } from '@/context/NotificationsContext';
import { useEffect, useState, useRef, useCallback } from 'react';
import bellicon from "../../../assets/svg/bell.svg";

const ITEMS_PER_PAGE = 10;

const AllNotificationsTab = () => {
  const { notifications, setNotifications, markAsRead, deleteNotification, showLessLikeThis } = useNotifications();
  const [displayedNotifications, setDisplayedNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const lastNotificationRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    // Initialize with sample notifications
    if (notifications.length === 0) {
      const sampleNotifications = [
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
              content: 'My name is Jerry Lamp, i am a traveler and explorer.',
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
            timeAgo: '5 min ago',
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
            timeAgo: '10 min ago'
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
            timeAgo: '15 min ago',
            comment: 'Great post! Looking forward to more content.'
          }
        },
        {
          id: '6',
          type: 'system',
          data: {
            content: 'New security update available',
            timeAgo: '20 min ago'
          },
          isUnread: true
        },
        {
          id: '7',
          type: 'like',
          data: {
            likers: [
              { name: 'John Doe', avatar: image3 }
            ],
            timeAgo: '25 min ago',
            post: {
              content: 'Just shared my latest travel experience!'
            }
          }
        },
        {
          id: '8',
          type: 'comment',
          data: {
            commenter: {
              name: 'Alege Samuel',
              avatar: image2
            },
            timeAgo: '30 min ago',
            comment: 'This is exactly what I was looking for!'
          }
        },
        {
          id: '9',
          type: 'system',
          data: {
            content: 'Your account settings have been updated',
            timeAgo: '35 min ago'
          }
        },
        {
          id: '10',
          type: 'like',
          data: {
            likers: [
              { name: 'Jerry Lamp', avatar: image1 },
              { name: 'John Doe', avatar: image3 }
            ],
            timeAgo: '40 min ago',
            post: {
              content: 'Check out my new travel guide!'
            }
          }
        },
        {
          id: '11',
          type: 'comment',
          data: {
            commenter: {
              name: 'John Doe',
              avatar: image3
            },
            timeAgo: '45 min ago',
            comment: 'Very informative post!'
          }
        },
        {
          id: '12',
          type: 'system',
          data: {
            content: 'New feature: Dark mode is now available',
            timeAgo: '50 min ago'
          }
        },
        {
          id: '13',
          type: 'like',
          data: {
            likers: [
              { name: 'Alege Samuel', avatar: image2 },
              { name: 'Jerry Lamp', avatar: image1 }
            ],
            timeAgo: '55 min ago',
            post: {
              content: 'Sharing my favorite travel destinations'
            }
          }
        },
        {
          id: '14',
          type: 'comment',
          data: {
            commenter: {
              name: 'Jerry Lamp',
              avatar: image1
            },
            timeAgo: '1 hour ago',
            comment: 'Thanks for sharing this valuable information!'
          }
        },
        {
          id: '15',
          type: 'system',
          data: {
            content: 'Your profile has been verified',
            timeAgo: '1 hour ago'
          }
        }
      ];
      setNotifications(sampleNotifications);
    }
  }, [notifications.length, setNotifications]);

  useEffect(() => {
    setDisplayedNotifications(notifications.slice(0, page * ITEMS_PER_PAGE));
    setHasMore(notifications.length > page * ITEMS_PER_PAGE);
  }, [notifications, page]);

  const loadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setPage(prev => prev + 1);
      setLoading(false);
    }, 1000);
  };

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
      {displayedNotifications.map((notification, index) => (
        <div
          key={notification.id}
          ref={index === displayedNotifications.length - 1 ? lastNotificationRef : null}
        >
          <NotificationCard
            id={notification.id}
            type={notification.type}
            data={notification.data}
            isLast={index === displayedNotifications.length - 1}
            isFirst={index === 0}
            isUnread={notification.isUnread}
            onMarkAsRead={markAsRead}
            onDelete={deleteNotification}
            onShowLess={showLessLikeThis}
          />
        </div>
      ))}
      
      {loading && (
        <div className="flex justify-center items-center py-4">
          <div className="w-6 h-6 border-2 border-[#5762D5] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {!loading && hasMore && (
        <button
          onClick={loadMore}
          className="w-full py-3 text-center text-gray-600 hover:text-gray-900 transition-colors border-t border-[#D4D4D4]"
        >
          Show more results
        </button>
      )}
    </div>
  );
};

export default AllNotificationsTab; 