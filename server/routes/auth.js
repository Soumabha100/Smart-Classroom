// server/routes/auth.js
const router = require("express").Router();
const rateLimit = require("express-rate-limit");
// Import controller functions
const {
  register,
  login,
  googleLogin,
  completeGoogleSignup,
  forgotPassword,
  resetPassword,
  verifyResetToken,
  getSessions, 
  revokeSession, 
  revokeAllSessions
} = require("../controllers/authController");

const { protect } = require("../middlewares/authMiddleware");
// Import validation tools from express-validator
const { body, validationResult } = require("express-validator");

// Configure Rate Limiter for Login Attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login requests per window
  message: {
    message: "Too many login attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

const { refreshToken, logout } = require("../controllers/authController");

router.post("/refresh", refreshToken);
router.post("/logout", logout);

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
  loginLimiter, // Apply rate limiting
  loginValidationRules, // 1. Run these validation rules
  validate, // 2. Run our custom 'validate' middleware
  login // 3. If validation passes, run the 'login' controller
);

// @route   POST api/auth/google-login
// @desc    Google Sign Up / Login (Check User)
// @access  Public
router.post("/google-login", loginLimiter, googleLogin);

// @route   POST api/auth/google-complete
// @desc    Complete Google Signup (Create User)
// @access  Public
router.post("/google-complete", completeGoogleSignup);

// @route   POST api/auth/forgot-password
// @desc    Request password reset email
// @access  Public
router.post("/forgot-password", forgotPassword);

// @route   PUT api/auth/reset-password/:resetToken
// @desc    Reset password with token
// @access  Public
router.put("/reset-password/:resetToken", resetPassword);

// @route   GET api/auth/verify-token/:resetToken
// @desc    Verify if reset token is still valid
// @access  Public
router.get("/verify-token/:resetToken", verifyResetToken);

// 🆕 Session Management Routes (Protected)
router.get("/sessions", protect, getSessions);
router.delete("/sessions/:sessionId", protect, revokeSession);
router.delete("/sessions", protect, revokeAllSessions); // Delete all except current

module.exports = router;
