// server/routes/analyticsRoutes.js
const router = require("express").Router();
const { getAdminAnalytics } = require("../controllers/analyticsController");
const { verifyToken } = require("../middlewares/authMiddleware");
const checkRole = require("../middlewares/checkRole");

// GET /api/analytics/summary
router.get("/summary", verifyToken, checkRole(["admin"]), getAdminAnalytics);

module.exports = router;
