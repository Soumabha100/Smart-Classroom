const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    // The header format is "Bearer TOKEN". We split it and take the second part.
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Token is not valid!" });
      }
      // If the token is valid, we attach the user's info to the request object
      req.user = user;
      next(); // Move on to the next function (the controller)
    });
  } else {
    return res.status(401).json({ message: "You are not authenticated!" });
  }
};

module.exports = { verifyToken };