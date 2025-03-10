import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const CommentContext = createContext();

export const CommentProvider = ({ children }) => {
  const [comments, setComments] = useState(() => {
    const savedComments = localStorage.getItem('comments');
    return savedComments ? JSON.parse(savedComments) : [];
  });

  const addComment = (comment) => {
    setComments((prevComments) => {
      const updatedComments = [comment, ...prevComments];
      localStorage.setItem('comments', JSON.stringify(updatedComments)); // Save to local storage
      return updatedComments;
    });
  };

  return (
    <CommentContext.Provider value={{ comments, addComment }}>
      {children}
    </CommentContext.Provider>
  );
};

CommentProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useComments = () => useContext(CommentContext); 