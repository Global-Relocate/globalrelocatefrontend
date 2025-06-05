import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const PostContext = createContext();

const postReducer = (state, action) => {
  switch (action.type) {
    case "ADD_POST": {
      const updatedPosts = [action.payload, ...state];
      localStorage.setItem("posts", JSON.stringify(updatedPosts));
      return updatedPosts;
    }
    case "INITIALIZE":
      return action.payload;
    default:
      return state;
  }
};

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

  const addPost = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const deletePost = (postId) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  return (
    <PostContext.Provider value={{ posts, addPost, deletePost }}>
      {children}
    </PostContext.Provider>
  );
};

PostProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const usePosts = () => useContext(PostContext);
