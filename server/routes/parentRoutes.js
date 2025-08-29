const router = require('express').Router();
const { registerParent, getParents } = require('../controllers/parentController');
const { verifyToken } = require('../middlewares/authMiddleware');

const checkAdminRole = (req, res, next) => {
  if (req.user && req.user.role === 'admin') next();
  else res.status(403).json({ message: 'Access denied. Admins only.' });
};

router.post('/register', verifyToken, checkAdminRole, registerParent);
router.get('/', verifyToken, checkAdminRole, getParents);

module.exports = router;