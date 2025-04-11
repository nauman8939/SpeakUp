import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const BlogCard = ({ blog, isAuthor, onDelete }) => {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const formattedDate = format(new Date(blog.createdAt), 'MMM d, yyyy');

  const cleanTags = Array.isArray(blog.tags)
  ? blog.tags
      .join(',')                     
      .replace(/[\[\]"]+/g, '')      
      .split(',')                  
      .map(tag => tag.trim())        
      .filter(tag => tag.length > 0) 
  : [];

  const handleDelete = () => {
    onDelete(blog._id);
    setDeleteModalOpen(false);
  };

  return (
    <div className="relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100 group">
      
      {/* Edit/Delete Buttons */}
      {isAuthor && (
        <div className="absolute top-2 right-2 flex gap-2 z-10">
          <Link
            to={`/editBlog/${blog._id}`}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
            title="Edit"
          >
            <Pencil size={16} className="text-gray-700" />
          </Link>
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
            title="Delete"
          >
            <Trash2 size={16} className="text-red-600" />
          </button>
        </div>
      )}

      {/* Blog Image */}
      {blog.imageUrl && (
        <div className="h-48 w-full">
          <img
            src={blog.imageUrl}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Blog Content */}
      <div className="p-5">
        <div className="mt-1 font-medium text-black-700">
          {blog.author?.name || 'Unknown Author'}
        </div>
        <div className="text-sm text-gray-500 mb-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Calendar size={14} className="text-gray-400" />
              <span>{formattedDate}</span>
            </div>
            <span className="mx-1">•</span>
            <div className="flex items-center gap-1">
              <Clock size={14} className="text-gray-400" />
              <span>5 min read</span>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-bold mb-2 line-clamp-2">{blog.title}</h3>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {blog.content}
        </p>

        <div className="flex justify-between items-center mt-4">
          <div className="flex flex-wrap gap-2">
            {cleanTags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs rounded-full"
                style={{
                  backgroundColor: getTagColor(tag).bg,
                  color: getTagColor(tag).text
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <Link
            to={`/blogs/${blog._id}`}
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            Read more →
          </Link>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteModalOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6 z-50"
            >
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Blog?</h3>
                <p className="text-gray-500 mb-6">Are you sure you want to delete this blog? This action cannot be undone.</p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setDeleteModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Tag color helper
const getTagColor = (tag) => {
  const colors = [
    { bg: '#EFF6FF', text: '#1E40AF' },
    { bg: '#ECFDF5', text: '#065F46' },
    { bg: '#FEF2F2', text: '#991B1B' },
    { bg: '#F5F3FF', text: '#5B21B6' },
    { bg: '#FFFBEB', text: '#92400E' },
  ];
  const index = Math.abs(tag.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % colors.length;
  return colors[index];
};

export default BlogCard;
