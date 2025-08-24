const router = require('express').Router();
const { getUserProfile } = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware'); // Import the middleware

// This route is now protected. The verifyToken middleware will run before getUserProfile.
router.get('/profile', verifyToken, getUserProfile);

module.exports = router;