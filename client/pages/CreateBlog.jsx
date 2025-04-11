import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlogs } from '../context/BlogContext';
import { Image, Upload, X } from 'lucide-react';
import { useUser } from '../context/UserContext';

const CreateBlog = () => {
  const { createBlog } = useBlogs();
  const navigate = useNavigate();
  const dropdownRef = useRef();
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableTags = [
    'Technology',
    'Food',
    'Programming',
    'Design',
    'Business',
    'Lifestyle',
    'Health',
    'Education'
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file); // Save the actual File object
    }
  };

  const handleTagSelect = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('title', e.target.title.value.trim());
    formData.append('content', e.target.content.value.trim());
    formData.append('tags', JSON.stringify(selectedTags));
    formData.append('author', user?._id);
    formData.append('authorid', user?.email);
  
    if (selectedImage) {
      formData.append('image', selectedImage);
    }
  
    try {
      await createBlog(formData);
      setSelectedImage(null);
      setSelectedTags([]);
      navigate('/');
    } catch (error) {
      alert('Error creating blog: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsTagDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Create New Post</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Title</h2>
          <input
            type="text"
            name="title"
            placeholder="Enter post title"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Image */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Feature Image</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {selectedImage ? (
              <div className="relative">
                <img
                  src={URL.createObjectURL(selectedImage)} // Preview from File object
                  alt="Preview"
                  className="max-h-64 mx-auto rounded-lg mb-4"
                />
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-3">
                <Image className="w-10 h-10 text-gray-400" />
                <p className="text-gray-500">Drag and drop your image here, or</p>
                <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition inline-flex items-center gap-2">
                  <Upload size={16} />
                  Browse Files
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2" ref={dropdownRef}>
          <h2 className="text-xl font-semibold">Tags</h2>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
              className="w-full p-3 border border-gray-300 rounded-lg text-left flex justify-between items-center"
            >
              <span>{selectedTags.length > 0 ? selectedTags.join(', ') : 'Select tags...'}</span>
              <svg
                className={`w-5 h-5 transition-transform ${isTagDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isTagDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                {availableTags.map((tag) => (
                  <div
                    key={tag}
                    onClick={() => handleTagSelect(tag)}
                    className={`p-3 cursor-pointer flex items-center hover:bg-gray-50 ${
                      selectedTags.includes(tag) ? 'bg-blue-50' : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag)}
                      readOnly
                      className="mr-2 h-4 w-4 text-blue-600"
                    />
                    {tag}
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleTagSelect(tag)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Content</h2>
          <textarea
            name="content"
            placeholder="Write your post content here..."
            required
            rows={10}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Preview
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 rounded-md transition ${
              isSubmitting ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
                <span>Publishing...</span>
              </div>
            ) : (
              'Publish Post'
            )}
          </button>

        </div>
      </form>
    </div>
  );
};

export default CreateBlog;
