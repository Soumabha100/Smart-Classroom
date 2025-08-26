const router = require('express').Router();
const { generateQrToken, markAttendance } = require('../controllers/attendanceController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Teacher route (we'll add role checks later)
router.post('/generate-qr', verifyToken, generateQrToken);

// Student route
router.post('/mark', verifyToken, markAttendance);

module.exports = router;