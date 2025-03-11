import { markNotificationsAsRead } from '@/services/api';
import CommunityPostCard from './CommunityPostCard';

const NotificationCard = ({ 
  id, 
  type, 
  data, 
  isLast, 
  isUnread = false, 
  isFirst = false,
}) => {
  const [isDeleted, setIsDeleted] = useState(false);
  const { showUndoToast } = useUndo();

  const handleMarkAsRead = async () => {
    try {
      const response = await markNotificationsAsRead([id]);
      if (response.success) {
        showToast({
          message: "Notification marked as read",
          type: "success"
        });
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      showToast({
        message: "Failed to mark notification as read",
        type: "error"
      });
    }
  };

  const renderNotificationContent = () => {
    const dropdownMenu = (
      // ... existing dropdown menu code ...
    );

    switch (type) {
      case 'COMMENT':
        return (
          <div className="flex items-start gap-3">
            <div className="relative">
              <img 
                src={data.sender.profilePic} 
                alt={data.sender.username} 
                className="w-10 h-10 rounded-full"
              />
              {isUnread && (
                <div className="absolute -top-1 -right-1">
                  <div className="w-3 h-3 bg-[#2563EB] rounded-full">
                    <div className="absolute inset-0 bg-[#2563EB] rounded-full animate-ping" />
                  </div>
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-gray-800">
                <span className="font-medium text-[#5762D5]">{data.sender.username}</span> 
                {' commented on your post'}
              </p>
              {data.comment && (
                <div className="mt-3 p-4 bg-white rounded-xl border border-[#D4D4D4]">
                  <p className="text-gray-800">{data.comment.content.text}</p>
                </div>
              )}
              {data.post && (
                <div className="mt-3">
                  <CommunityPostCard
                    id={data.post.id}
                    content={data.post.content.text}
                    images={data.post.content.media.map(m => m.url)}
                    timeAgo={new Date(data.post.timestamp).toLocaleString()}
                    avatar={data.sender.profilePic}
                    name={data.sender.username}
                  />
                </div>
              )}
            </div>
            {dropdownMenu}
          </div>
        );

      case 'LIKE':
        // Similar structure for like notifications
        // ... implement like notification rendering

      case 'BOOKMARK':
        // Similar structure for bookmark notifications
        // ... implement bookmark notification rendering

      default:
        return null;
    }
  };

  // ... rest of the component
};

export default NotificationCard; 