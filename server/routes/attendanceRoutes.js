const router = require('express').Router();
const { generateQrToken, markAttendance } = require('../controllers/attendanceController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/checkRole');
const { getAttendanceAnalytics } = require('../controllers/attendanceController');


// Teacher route
router.post('/generate-qr', verifyToken, checkRole, generateQrToken);
router.get('/analytics', verifyToken, checkRole, getAttendanceAnalytics);

// Student route
router.post('/mark', verifyToken, markAttendance);

module.exports = router;