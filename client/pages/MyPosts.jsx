import { useEffect } from 'react';
import { useBlogs } from '../context/BlogContext';
import { useUser } from '../context/UserContext';
import { Link } from 'react-router-dom';
import BlogCard from '../components/BlogCard';

const MyPosts = () => {
  const { blogs, loading, error, fetchBlogs, deleteBlog } = useBlogs();
  const { user } = useUser(); 

  useEffect(() => {
    fetchBlogs();
  }, []);

  const myBlogs = blogs.filter(blog => blog.author?._id === user?._id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">My Posts</h1>
        <Link 
          to="/createBlog" 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create New Post
        </Link>
      </div>

      {loading ? (
        <div className="text-center text-lg">Loading your blogs...</div>
      ) : error ? (
        <div className="text-red-500 text-center">Error: {error}</div>
      ) : myBlogs.length === 0 ? (
        <div className="text-center text-gray-500">You haven’t posted anything yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myBlogs.map(blog => (
            <BlogCard 
              key={blog._id}
              blog={blog}
              isAuthor={true}
              onDelete={deleteBlog}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPosts;
