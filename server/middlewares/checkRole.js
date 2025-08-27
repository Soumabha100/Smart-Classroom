// A middleware to check if the user has the 'teacher' role
const checkRole = (req, res, next) => {
  // The user object is attached to the request by the previous verifyToken middleware
  if (req.user && req.user.role === "teacher") {
    // If the user is a teacher, proceed to the next function (the controller)
    next();
  } else {
    // If not, send a forbidden error
    return res.status(403).json({ message: "Access denied. Teachers only." });
  }
};

module.exports = { checkRole };
