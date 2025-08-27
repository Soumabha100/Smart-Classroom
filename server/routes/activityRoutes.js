const router = require('express').Router();
const { getActivities, createActivity } = require('../controllers/activityController');
const { verifyToken } = require('../middlewares/authMiddleware');

// This route is protected; only logged-in users can access it.
router.get('/', verifyToken, getActivities);
router.post('/', verifyToken, createActivity); // For adding test data

module.exports = router;