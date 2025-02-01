import { useBookmarks } from "@/context/BookmarkContext";
import CommunityPostCard from "@/components/community/CommunityPostCard";
import { FaRegBookmark } from "react-icons/fa6";

const BookmarksTab = () => {
  const { bookmarks } = useBookmarks();

  if (!bookmarks || bookmarks.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg">
        <FaRegBookmark size={36} className="mx-auto mb-4 text-gray-600" />
        <h3 className="text-xl font-semibold mb-2">No bookmarked posts</h3>
        <p className="text-gray-600">Start bookmarking posts to keep them organized.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-20">
      {bookmarks.map((post, index) => (
        <CommunityPostCard key={index} {...post} />
      ))}
    </div>
  );
};

export default BookmarksTab; 