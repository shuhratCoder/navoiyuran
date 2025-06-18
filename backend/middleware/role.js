// backend/middleware/roleMiddleware.js

const User = require("../models/user");

const authorizeRole = (requiredRole) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user || user.role !== requiredRole) {
        return res
          .status(403)
          .json({ error: "Bu amalni bajarish uchun ruxsat yo‘q" });
      }
      next();
    } catch (error) {
      res.status(500).json({ error: "Server xatosi" });
    }
  };
};

module.exports = { authorizeRole };
