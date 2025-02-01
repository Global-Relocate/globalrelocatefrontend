import { createContext, useContext, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { FaRegBookmark, FaBookmark } from "react-icons/fa6";
import PropTypes from 'prop-types';

const BookmarkContext = createContext();

export const BookmarkProvider = ({ children }) => {
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('bookmarks');
    return saved ? JSON.parse(saved) : [];
  });
  const navigate = useNavigate();

  const toggleBookmark = (post) => {
    setBookmarks(prev => {
      const exists = prev.find(b => b.content === post.content && b.timeAgo === post.timeAgo);
      const newBookmarks = exists 
        ? prev.filter(b => !(b.content === post.content && b.timeAgo === post.timeAgo))
        : [...prev, post];
      
      localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
      
      if (exists) {
        toast(`Post removed from bookmarks`, {
          action: {
            label: 'View Bookmarks',
            onClick: () => navigate('/user/profile')
          },
          icon: <FaRegBookmark className="w-5 h-5" />,
          closeButton: true,
          dismissible: true
        });
      } else {
        toast(`Post added to bookmarks`, {
          action: {
            label: 'View Bookmarks',
            onClick: () => navigate('/user/profile')
          },
          icon: <FaBookmark className="w-5 h-5" />,
          closeButton: true,
          dismissible: true
        });
      }
      
      return newBookmarks;
    });
  };

  const isBookmarked = (post) => {
    return bookmarks.some(b => b.content === post.content && b.timeAgo === post.timeAgo);
  };

  return (
    <BookmarkContext.Provider value={{ bookmarks, toggleBookmark, isBookmarked }}>
      {children}
    </BookmarkContext.Provider>
  );
};

BookmarkProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useBookmarks = () => useContext(BookmarkContext); 