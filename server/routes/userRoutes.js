const router = require('express').Router();
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware'); // Import the middleware



// This route is now protected. The verifyToken middleware will run before getUserProfile.
router.get('/profile', verifyToken, getUserProfile);
router.post('/profile', verifyToken, updateUserProfile);

module.exports = router;