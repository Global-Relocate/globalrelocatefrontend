import NotificationCard from '../NotificationCard';
import NotificationSkeleton from '../NotificationSkeleton';
import { useEffect, useState, useRef, useCallback } from 'react';
import bellicon from "../../../assets/svg/bell.svg";
import { getNotifications } from '@/services/api';
import { showToast } from "@/components/ui/toast";
import { useNotifications } from '@/context/NotificationsContext';
import { formatTimeAgo } from '@/utils/dateUtils';

const ITEMS_PER_PAGE = 10;

const FollowingTab = () => {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const { markAsRead, deleteNotification, showLessLikeThis } = useNotifications();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await getNotifications(page, ITEMS_PER_PAGE, 'FOLLOW');
      
      if (response.success) {
        setNotifications(prev => [...prev, ...response.data]);
        setHasMore(response.data.length === ITEMS_PER_PAGE);
      }
    } catch (error) {
      console.error('Error fetching following notifications:', error);
      showToast({
        message: "Failed to load following notifications",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [page]);

  const lastNotificationRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  if (loading && notifications.length === 0) {
    return (
      <div className="w-full bg-[#F8F7F7] rounded-2xl">
        {[1, 2, 3].map((_, index) => (
          <NotificationSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!loading && notifications.length === 0) {
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
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          ref={index === notifications.length - 1 ? lastNotificationRef : null}
        >
          <NotificationCard
            id={notification.id}
            type={notification.type.toLowerCase()}
            data={{
              timeAgo: formatTimeAgo(notification.createdAt),
              sender: notification.sender,
              post: notification.post,
              comment: notification.Comment,
              content: notification.content,
              like: notification.Like,
              bookmark: notification.Bookmark
            }}
            isLast={index === notifications.length - 1}
            isFirst={index === 0}
            isUnread={!notification.isRead}
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
          onClick={fetchNotifications}
          className="w-full py-3 text-center text-gray-600 hover:text-gray-900 transition-colors border-t border-[#D4D4D4]"
        >
          Show more results
        </button>
      )}
    </div>
  );
};

export default FollowingTab; 