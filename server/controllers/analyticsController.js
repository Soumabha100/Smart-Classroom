// server/controllers/analyticsController.js
const User = require("../models/User");
const Class = require("../models/Class");

async function getAdminAnalytics(req, res) {
  try {
    // Parallel fetching for performance
    const [userCounts, classEnrollments] = await Promise.all([
      User.aggregate([
        { $group: { _id: "$role", count: { $sum: 1 } } },
        { $project: { _id: 0, role: "$_id", count: 1 } },
      ]),
      Class.aggregate([
        {
          $project: {
            name: 1,
            studentCount: { $size: "$students" },
          },
        },
        { $sort: { studentCount: -1 } },
        { $limit: 5 },
      ]),
    ]);

    // Format the user counts into a more accessible object
    const formattedUserCounts = userCounts.reduce((acc, item) => {
      acc[item.role] = item.count;
      return acc;
    }, {});

    res.status(200).json({
      userCounts: formattedUserCounts,
      classEnrollments,
    });
  } catch (error) {
    console.error("[getAdminAnalytics] error:", error);
    res.status(500).json({ message: "Server error fetching analytics" });
  }
}

module.exports = { getAdminAnalytics };
