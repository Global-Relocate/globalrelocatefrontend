import { createContext, useContext, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';

const PostContext = createContext();

const postReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_POST':
      const updatedPosts = [action.payload, ...state];
      localStorage.setItem('posts', JSON.stringify(updatedPosts));
      return updatedPosts;
    case 'INITIALIZE':
      return action.payload;
    default:
      return state;
  }
};

export const PostProvider = ({ children }) => {
  const [posts, dispatch] = useReducer(postReducer, []);

  useEffect(() => {
    const savedPosts = localStorage.getItem('posts');
    if (savedPosts) {
      dispatch({ type: 'INITIALIZE', payload: JSON.parse(savedPosts) });
    }
  }, []);

  const addPost = (post) => {
    dispatch({ type: 'ADD_POST', payload: post });
  };

  return (
    <PostContext.Provider value={{ posts, addPost }}>
      {children}
    </PostContext.Provider>
  );
};

PostProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const usePosts = () => useContext(PostContext); 