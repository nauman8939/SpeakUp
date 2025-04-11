const Blog = require('../models/Blog');

// Get all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'name email');
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blogs', error: error.message });
  }
};

// Get single blog
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'name email');
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog', error: error.message });
  }
};

// Create new blog
exports.createBlog = async (req, res) => {
  try {
    const { title, content, tags, author, authorid } = req.body;
    const imageUrl = req.file?.path;
    console.log("Image URL",imageUrl);
    const blog = new Blog({
      title,
      content,
      imageUrl,
      tags,
      author,
      authorid
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error creating blog', error: error.message });
  }
};
// Update blog
exports.updateBlog = async (req, res) => {
  try {

    const { title, content, imageUrl,tags } = req.body;
    const blog = await Blog.findOneAndUpdate(
      { _id: req.params.id, author: req.userId },
      { title, content, imageUrl, tags,updatedAt: Date.now() },
      { new: true }
    );
    if (!blog) return res.status(404).json({ message: 'Blog not found or unauthorized' });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error updating blog', error: error.message });
  }
};

// Delete blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findOneAndDelete({ _id: req.params.id, author: req.userId });
    if (!blog) return res.status(404).json({ message: 'Blog not found or unauthorized' });
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting blog', error: error.message });
  }
};