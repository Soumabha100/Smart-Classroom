const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "You are not authenticated!" });
  }

  const token = authHeader.split(" ")[1];

  if (!token || token === "undefined" || token === "null") {
    return res.status(401).json({ message: "Token is missing or invalid." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT verify error:", err.message);
      return res.status(403).json({ message: "Token is not valid!" });
    }

    // --- THE CRUCIAL FIX IS HERE ---
    // We must ensure the decoded token has the user's ID.
    if (!decoded || !decoded.id) {
      console.error("JWT Error: Token is valid but does not contain user ID.");
      return res
        .status(403)
        .json({ message: "Token is missing user information!" });
    }

    // Attach the decoded payload to the request object.
    req.user = decoded;
    next();
  });
};

module.exports = {
  verifyToken,
  protect: verifyToken, // alias for compatibility
};
