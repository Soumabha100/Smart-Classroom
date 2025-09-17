// server/middlewares/checkRole.js

// Factory: call checkRole(['student']) -> returns middleware (req,res,next)
const checkRole = (allowedRoles = []) => {
  // ensure allowedRoles is an array of strings
  if (!Array.isArray(allowedRoles)) {
    allowedRoles = [allowedRoles];
  }

  return (req, res, next) => {
    // The user object should be attached by your 'protect' middleware
    const role = req.user?.role;

    if (!role) {
      return res.status(401).json({ message: 'Unauthorized: user not found' });
    }

    if (allowedRoles.includes(role)) {
      return next();
    }

    return res.status(403).json({ message: 'Access denied. Insufficient role.' });
  };
};

module.exports = { checkRole };
