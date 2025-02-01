import { createContext, useContext, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { FaRegBookmark, FaBookmark } from "react-icons/fa6";

const BookmarkContext = createContext();

export const BookmarkProvider = ({ children }) => {
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('bookmarks');
    return saved ? JSON.parse(saved) : [];
  });
  const navigate = useNavigate();

  const toggleBookmark = (post) => {
    setBookmarks(prev => {
      const exists = prev.find(b => b.id === post.id);
      const newBookmarks = exists 
        ? prev.filter(b => b.id !== post.id)
        : [...prev, post];
      
      localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
      
      if (exists) {
        toast(`Post removed from bookmarks`, {
          action: {
            label: 'View Bookmarks',
            onClick: () => navigate('/user/profile?tab=bookmarks')
          },
          icon: <FaRegBookmark className="w-5 h-5" />,
          closeButton: true,
          dismissible: true
        });
      } else {
        toast(`Post saved to bookmarks`, {
          action: {
            label: 'View Bookmarks',
            onClick: () => navigate('/user/profile?tab=bookmarks')
          },
          icon: <FaBookmark className="w-5 h-5" />,
          closeButton: true,
          dismissible: true
        });
      }
      
      return newBookmarks;
    });
  };

  const isBookmarked = (postId) => {
    return bookmarks.some(b => b.id === postId);
  };

  return (
    <BookmarkContext.Provider value={{ bookmarks, toggleBookmark, isBookmarked }}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = () => useContext(BookmarkContext); 