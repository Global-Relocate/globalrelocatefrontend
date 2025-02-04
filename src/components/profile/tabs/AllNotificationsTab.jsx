import PropTypes from 'prop-types';
import bellicon from "../../../assets/svg/bell.svg";
import image1 from "../../../assets/images/image1.png";
import image2 from "../../../assets/images/image2.png";

const NotificationItem = ({ avatar, name, action, content, time }) => (
  <div className="flex items-start gap-4 p-6 bg-[#F8F7F7] rounded-2xl mb-4 border border-[#D4D4D4] hover:bg-gray-100 transition-colors">
    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
      <img src={avatar} alt={name} className="w-full h-full object-cover" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-start mb-1">
        <div className="flex items-center gap-1">
          <span className="font-semibold text-black">{name}</span>
          <span className="text-gray-500">{action}</span>
        </div>
        <span className="text-sm text-gray-500 whitespace-nowrap">{time}</span>
      </div>
      {content && (
        <p className="text-gray-600 leading-relaxed">{content}</p>
      )}
    </div>
  </div>
);

NotificationItem.propTypes = {
  avatar: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
  content: PropTypes.string,
  time: PropTypes.string.isRequired,
  title: PropTypes.string,
};

const AllNotificationsTab = () => {
  const notifications = [
    {
      avatar: image1,
      name: "Jerry Lamp",
      action: "posted: Hello everyone!",
      content: "My name is Jerry Lamp, i am a traveler and explorer, i am excited about anything related to traveling and would like to connect with liked minded as well on this platform, feel free to say hi.",
      time: "2 min ago"
    },
    {
      avatar: image2,
      name: "Alege Samuel",
      action: "commented on your post",
      time: "2 min ago"
    }
  ];

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
    <div className="space-y-4">
      {notifications.map((notification, index) => (
        <NotificationItem key={index} {...notification} />
      ))}
    </div>
  );
};

export default AllNotificationsTab; 