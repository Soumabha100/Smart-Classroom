/**
 * asyncHandler: Wraps async controller functions to catch errors automatically.
 * Eliminates the need for try/catch in every controller.
 *
 * Usage:
 *   exports.getUser = asyncHandler(async (req, res) => {
 *     const user = await User.findById(req.user.id);
 *     if (!user) {
 *       res.status(404);
 *       throw new Error("User not found");
 *     }
 *     res.json(user);
 *   });
 */

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
