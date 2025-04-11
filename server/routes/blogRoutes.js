const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// Public routes
router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);

const logImageMiddleware = (req, res, next) => {
  console.log('Uploaded file:', req.file); 
  next();
};

// Protected routes
router.post(
  '/createblogs',
  authMiddleware,
  upload.single('image'), 
  logImageMiddleware,    
  blogController.createBlog
);

router.put(
  '/updateblogs/:id',
  authMiddleware,
  upload.single('image'), 
  blogController.updateBlog
);

router.delete('/deleteblogs/:id', authMiddleware, blogController.deleteBlog);

module.exports = router;
