import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const NewsCard = ({ id, data, isFirst, isLast }) => {
  const renderNotificationContent = () => {
    const dropdownMenu = (
      <div className="flex flex-col items-end">
        <span className="text-sm text-gray-500 mt-1">{data.timeAgo}</span>
      </div>
    );

    return (
      <div
        className="flex flex-col flex-wrap md:flex-row md:items-center gap-3"
        id={`news-${id}`}
      >
        <div className="rounded-md flex items-center justify-center">
          <img
            src={data.image}
            alt={data.title}
            className="w-full h-[180px] md:w-[180px] md:h-[100px] rounded-md"
          />
        </div>

        <div className="flex-1 flex flex-col">
          <div className="text-gray-800 break-words text-md">{data.title}</div>
          <p className="text-gray-600 text-sm mt-1">Source: {data.source}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center justify-between mt-1">
            <span className="text-gray-600 text-sm capitalize flex items-center gap-x-2">
              <i className="far fa-folder" /> {data.category}
            </span>
            <span className="text-gray-600 text-sm capitalize flex items-center gap-x-2">
              <i className="far fa-language" /> {data.language}
            </span>
            <span className="text-gray-600 text-sm capitalize flex items-center gap-x-2">
              <i className="far fa-globe-europe" /> {data.country}
            </span>
          </div>
        </div>
        {dropdownMenu}
      </div>
    );
  };

  return (
    <Link
      to={data.link}
      className={`w-full transition-colors cursor-pointer
        ${isFirst ? "rounded-t-2xl" : ""}
        ${isLast ? "rounded-b-2xl" : ""}
      `}
      title={data.title}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="px-6 py-4">{renderNotificationContent()}</div>
      {!isLast && <div className="w-full h-[1px] bg-[#D4D4D4]" />}
    </Link>
  );
};

NewsCard.propTypes = {
  id: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  isFirst: PropTypes.bool,
  isLast: PropTypes.bool,
};

export default NewsCard;
