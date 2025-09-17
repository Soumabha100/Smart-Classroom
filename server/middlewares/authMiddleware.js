// server/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "You are not authenticated!" });
  }

  // Expect "Bearer <token>"
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: "Malformed authorization header" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('JWT verify error:', err && err.message);
      return res.status(403).json({ message: "Token is not valid!" });
    }

    // Attach decoded token payload as req.user
    // Make sure when you sign tokens you include the user's id and role:
    // jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, ...)
    req.user = decoded;
    // small debug (remove later if noisy)
    // console.log('verifyToken - attached req.user =>', req.user);

    next();
  });
};

// Export both names so existing code that expects either works
module.exports = {
  verifyToken,
  protect: verifyToken, // alias for compatibility with routes using `protect`
};
