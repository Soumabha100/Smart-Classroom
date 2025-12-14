// server/routes/auth.js
const router = require("express").Router();
// Import controller functions
const {
  register,
  login,
  googleLogin,
  completeGoogleSignup,
} = require("../controllers/authController");
// Import validation tools from express-validator
const { body, validationResult } = require("express-validator");

// --- Validation Middleware ---
// This new middleware function checks the result of the validation rules
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next(); // If no errors, continue to the controller (register or login)
  }
  // If there are errors, stop and send a 400 response with the error messages
  return res.status(400).json({ errors: errors.array() });
};

// --- Validation Rules ---
// Define the rules for the '/register' route
const registerValidationRules = [
  // name must not be empty, then trim and escape it
  body("name", "Name is required").not().isEmpty().trim().escape(),

  // email must be a valid email, then normalize it (e.g., lowercase)
  body("email", "Please include a valid email").isEmail().normalizeEmail(),

  // password must be at least 6 chars long
  body("password", "Password must be 6 or more characters").isLength({
    min: 6,
  }),

  // role must be one of these specific values
  body("role", "Role is required").isIn(["student", "teacher", "admin"]),
];

// Define the rules for the '/login' route
const loginValidationRules = [
  // email must be a valid email
  body("email", "Please include a valid email").isEmail().normalizeEmail(),

  // password is required
  body("password", "Password is required").not().isEmpty(),
];

// --- Route Definitions ---

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post(
  "/register",
  registerValidationRules, // 1. Run these validation rules
  validate, // 2. Run our custom 'validate' middleware
  register // 3. If validation passes, run the 'register' controller
);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  "/login",
  loginValidationRules, // 1. Run these validation rules
  validate, // 2. Run our custom 'validate' middleware
  login // 3. If validation passes, run the 'login' controller
);

// @route   POST api/auth/google-login
// @desc    Google Sign Up / Login (Check User)
// @access  Public
router.post("/google-login", googleLogin);

// @route   POST api/auth/google-complete
// @desc    Complete Google Signup (Create User)
// @access  Public
router.post("/google-complete", completeGoogleSignup);

module.exports = router;
