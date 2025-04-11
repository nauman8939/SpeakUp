import { useEffect, useState } from 'react';
import { useBlogs } from '../context/BlogContext';
import { useUser } from '../context/UserContext';
import BlogCard from '../components/BlogCard';

const Home = () => {
  const { blogs, loading, error, fetchBlogs, deleteBlog } = useBlogs();
  const { user } = useUser();

  const [selectedTag, setSelectedTag] = useState('All');
  const [sortType, setSortType] = useState('recent');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const extractTags = (tags) => {
    if (!Array.isArray(tags)) return [];

    return tags.flatMap(tag => {
      try {
        const parsed = JSON.parse(tag);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
      }

      return tag.split(',');
    })
    .map(tag => tag.trim().replace(/[\[\]"]+/g, ''))
    .filter(tag => tag.length > 0);
  };

  const allTags = Array.from(
    new Set(
      blogs.flatMap(blog => extractTags(blog.tags))
    )
  );

  const filteredBlogs = blogs
    .filter(blog => {
      if (selectedTag === 'All') return true;

      const tags = extractTags(blog.tags);
      return tags.includes(selectedTag);
    })
    .sort((a, b) => {
      if (sortType === 'recent') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0; 
    });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Latest Posts</h1>

        <div className="flex gap-3 flex-wrap">
          {/* Sort Dropdown */}
          <select
            value={sortType}
            onChange={e => setSortType(e.target.value)}
            className="px-3 py-1 rounded-md border border-gray-300 text-sm"
          >
            <option value="recent">Most Recent</option>
          </select>

          <select
            value={selectedTag}
            onChange={e => setSelectedTag(e.target.value)}
            className="px-3 py-1 rounded-md border border-gray-300 text-sm"
          >
            <option value="All">All Tags</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Blog Cards */}
      {loading ? (
        <div className="text-center text-lg">Loading blogs...</div>
      ) : error ? (
        <div className="text-red-500 text-center">Error: {error}</div>
      ) : filteredBlogs.length === 0 ? (
        <div className="text-center text-gray-500">No blogs found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBlogs.map(blog => (
            <BlogCard
              key={blog._id}
              blog={blog}
              isAuthor={user && user._id === blog.author?._id}
              onDelete={deleteBlog}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
