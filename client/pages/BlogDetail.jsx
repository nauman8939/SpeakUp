import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from '../src/api/axios';
import { useUser } from '../context/UserContext';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`/blogs/${id}`);
        setBlog(response.data);
      } catch (err) {
        console.error('Error fetching blog:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) return <div className="text-center py-16 text-gray-600">Loading...</div>;
  if (!blog) return <div className="text-center py-16 text-red-500">Blog not found</div>;

  const isAuthor = user && user._id === blog.author?._id;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <article className="bg-white rounded-2xl shadow-lg p-8 transition hover:shadow-xl duration-300">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
          {blog.title}
        </h1>

        {blog.imageUrl && (
          <img 
            src={blog.imageUrl} 
            alt={blog.title} 
            className="w-full h-72 object-cover rounded-xl mb-6 shadow-md"
          />
        )}

        <div className="text-base leading-relaxed text-gray-800 whitespace-pre-line mb-6">
          {blog.content}
        </div>

        <footer className="border-t pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500">
          <p>
            Posted by <span className="font-medium text-gray-700">{blog.author?.name || 'Unknown'}</span> 
            {' '}on {new Date(blog.createdAt).toLocaleDateString()}
          </p>

        </footer>
      </article>
    </div>
  );
};

export default BlogDetail;
