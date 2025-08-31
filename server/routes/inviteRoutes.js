const router = require('express').Router();
const { generateInvite, getInvites } = require('../controllers/invitationController');
const { verifyToken } = require('../middlewares/authMiddleware');

const checkAdminRole = (req, res, next) => {
  if (req.user && req.user.role === 'admin') next();
  else res.status(403).json({ message: 'Access denied. Admins only.' });
};

router.post('/generate', verifyToken, checkAdminRole, generateInvite);
router.get('/', verifyToken, checkAdminRole, getInvites);

module.exports = router;