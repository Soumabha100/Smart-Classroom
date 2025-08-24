const User = require('../models/User');

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    // The user ID is attached to the request by the verifyToken middleware
    const user = await User.findById(req.user.id).select('-password'); // Exclude password from the result
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};