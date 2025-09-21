// server/middlewares/checkRole.js

const checkRole = (allowedRoles = []) => {
  if (!Array.isArray(allowedRoles)) {
    allowedRoles = [allowedRoles];
  }

  return (req, res, next) => {
    const role = req.user?.role;

    if (!role) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }

    if (allowedRoles.includes(role)) {
      return next();
    }

    return res
      .status(403)
      .json({ message: "Access denied. Insufficient role." });
  };
};

// --- THIS IS THE FIX ---
// We now export the function directly, not inside an object.
module.exports = checkRole;
