const router = require('express').Router();
const { generateQrToken, markAttendance } = require('../controllers/attendanceController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/checkRole');

// Teacher route
router.post('/generate-qr', verifyToken, checkRole, generateQrToken);

// Student route
router.post('/mark', verifyToken, markAttendance);

module.exports = router;