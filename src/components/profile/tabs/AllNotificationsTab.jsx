import NotificationCard from '../NotificationCard';
import image1 from "@/assets/images/image1.png";
import image2 from "@/assets/images/image2.png";
import image3 from "@/assets/images/image3.png";
import image4 from "@/assets/images/image4.png";

const AllNotificationsTab = () => {
  const notifications = [
    {
      type: 'system',
      data: {
        content: 'Tax rates in Nigeria have changed',
        timeAgo: '2 min ago'
      },
      isUnread: true
    },
    {
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
      type: 'system',
      data: {
        content: 'Tax rates in Colombia have changed',
        timeAgo: '2 min ago'
      }
    },
    {
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
  ];

  return (
    <div className="w-full bg-[#F8F7F7] rounded-2xl">
      {notifications.map((notification, index) => (
        <NotificationCard
          key={index}
          type={notification.type}
          data={notification.data}
          isLast={index === notifications.length - 1}
          isFirst={index === 0}
          isUnread={notification.isUnread}
        />
      ))}
    </div>
  );
};

export default AllNotificationsTab; 