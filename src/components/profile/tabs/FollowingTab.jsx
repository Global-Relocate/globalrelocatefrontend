import NotificationCard from '../NotificationCard';
import { useNotifications } from '@/context/NotificationsContext';
import { useEffect, useState, useRef, useCallback } from 'react';
import image2 from "@/assets/images/image2.png";
import image3 from "@/assets/images/image3.png";
import bellicon from "../../../assets/svg/bell.svg";

const ITEMS_PER_PAGE = 10;

const FollowingTab = () => {
  const [followingNotifications, setFollowingNotifications] = useState([]);
  const [displayedNotifications, setDisplayedNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const { markAsRead, deleteNotification, showLessLikeThis } = useNotifications();

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
    // Initialize with sample following notifications
    const users = [
      { name: 'Alege Samuel', avatar: image2 },
      { name: 'John Doe', avatar: image3 }
    ];
    
    const sampleFollowing = Array.from({ length: 15 }, (_, i) => ({
      id: `following-${i + 1}`,
      type: 'system',
      data: {
        content: (
          <p className="text-gray-800">
            <span className="font-medium text-[#5762D5]">{users[i % 2].name}</span> has started following you
          </p>
        ),
        timeAgo: `${(i + 1) * 5} min ago`,
        follower: users[i % 2]
      },
      isUnread: i < 3
    }));
    setFollowingNotifications(sampleFollowing);
  }, []);

  useEffect(() => {
    setDisplayedNotifications(followingNotifications.slice(0, page * ITEMS_PER_PAGE));
    setHasMore(followingNotifications.length > page * ITEMS_PER_PAGE);
  }, [followingNotifications, page]);

  const loadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setPage(prev => prev + 1);
      setLoading(false);
    }, 1000);
  };

  const handleMarkAsRead = (id) => {
    setFollowingNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, isUnread: false }
          : notification
      )
    );
    markAsRead(id);
  };

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
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDelete}
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

export default FollowingTab; 