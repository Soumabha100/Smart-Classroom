const express = require('express');
const router = express.Router();
const { generateDashboard } = require('../controllers/aiController');

// Import middleware from their specific, correct files
const { protect } = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/checkRole');

const authModule = require('../middlewares/authMiddleware');
console.log('authModule =>', authModule);
console.log('typeof authModule.protect =>', typeof authModule.protect);



// @route   POST /api/ai/generate-dashboard
// @desc    Generate personalized dashboard content for a student
// @access  Private (Students only)
router.post(
    '/generate-dashboard',
    protect, // Use the correctly imported 'protect' function
    checkRole(['student']), // Use the correctly imported 'checkRole' function
    generateDashboard
);




module.exports = router;