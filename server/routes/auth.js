// server/routes/auth.js
const router = require('express').Router();
const { register, login } = require('../controllers/authController'); // Import the functions

// Point the routes to the controller functions
router.post('/register', register);
router.post('/login', login);

module.exports = router;