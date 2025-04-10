import { useEffect, useState } from 'react';
import BlogCard from '../components/BlogCard';
import axios from '../src/api/axios';

export default function Home() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/posts')
      .then(res => setBlogs(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">All Blog Posts</h2>
      <div className="grid gap-4">
        {blogs.length === 0 ? (
          <p>No blogs found.</p>
        ) : (
          blogs.map(blog => <BlogCard key={blog._id} blog={blog} />)
        )}
      </div>
    </div>
  );
}
