import NotificationCard from '../NotificationCard';
import { useNotifications } from '@/context/NotificationsContext';
import { useEffect, useState, useRef, useCallback } from 'react';
import image1 from "@/assets/images/image1.png";
import bellicon from "../../../assets/svg/bell.svg";

const ITEMS_PER_PAGE = 10;

const MentionsTab = () => {
  const [mentionNotifications, setMentionNotifications] = useState([]);
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
    // Initialize with sample mention notifications
    const sampleMentions = Array.from({ length: 15 }, (_, i) => ({
      id: `mention-${i + 1}`,
      type: 'system',
      data: {
        content: (
          <p className="text-gray-800">
            <span className="font-medium text-[#5762D5]">Jerry Lamp</span> mentioned you in a {i % 2 === 0 ? 'post' : 'comment'}: &quot;Hey @user, {i % 2 === 0 ? 'check out this amazing travel guide!' : 'thanks for the recommendation!'}
          </p>
        ),
        timeAgo: `${(i + 1) * 5} min ago`,
        mentioner: {
          name: 'Jerry Lamp',
          avatar: image1
        }
      },
      isUnread: i < 3
    }));
    setMentionNotifications(sampleMentions);
  }, []);

  useEffect(() => {
    setDisplayedNotifications(mentionNotifications.slice(0, page * ITEMS_PER_PAGE));
    setHasMore(mentionNotifications.length > page * ITEMS_PER_PAGE);
  }, [mentionNotifications, page]);

  const loadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setPage(prev => prev + 1);
      setLoading(false);
    }, 1000);
  };

  const handleMarkAsRead = (id) => {
    setMentionNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, isUnread: false }
          : notification
      )
    );
    markAsRead(id);
  };

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

export default MentionsTab; 