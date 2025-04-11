import { createContext, useContext, useState } from 'react';
import axios from '../src/api/axios';

const BlogContext = createContext();

export const useBlogs = () => useContext(BlogContext);

export const BlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/blogs');
      setBlogs(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching blogs');
    } finally {
      setLoading(false);
    }
  };

  const createBlog = async (blogData) => {
    try {
      console.log("DATAAA:", blogData);

      for (let pair of blogData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }
      const response = await axios.post('/blogs/createblogs', blogData);
      setBlogs(prev => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      throw err.response?.data?.message || 'Error creating blog';
    }
  };

  const updateBlog = async (id, blogData) => {
    try {
      const response = await axios.put(`/blogs/updateblogs/${id}`, blogData);
      setBlogs(prev => prev.map(blog => 
        blog._id === id ? response.data : blog
      ));
      return response.data;
    } catch (err) {
      throw err.response?.data?.message || 'Error updating blog';
    }
  };

  const deleteBlog = async (id) => {
    try {
      await axios.delete(`/blogs/deleteblogs/${id}`);
      setBlogs(prev => prev.filter(blog => blog._id !== id));
    } catch (err) {
      throw err.response?.data?.message || 'Error deleting blog';
    }
  };

  return (
    <BlogContext.Provider 
      value={{ 
        blogs, 
        loading, 
        error, 
        fetchBlogs, 
        createBlog, 
        updateBlog, 
        deleteBlog 
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};