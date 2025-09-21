const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const { protect } = require('../middlewares/authMiddleware'); // Assuming you have this middleware

router.post('/posts', protect, forumController.createPost);
router.get('/posts', protect, forumController.getPosts);
router.get('/posts/:id', protect, forumController.getPostById);
router.post('/posts/:postId/comments', protect, forumController.createComment);

module.exports = router;