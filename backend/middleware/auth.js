const jwt = require("jsonwebtoken");
const User = require("../models/user");

// JWT tokenni tekshirish middleware
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Token topilmadi" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // ← .env dan o‘qilyapti
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ error: "Token noto‘g‘ri yoki muddati o'tgan" });
  }
};

// Admin rolini tekshirish (faqat adminlarga)
const verifyAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Admin huquqi kerak" });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: "Server xatosi" });
  }
};

// Ruxsatni ro‘lga qarab tekshirish
const authorizeRole = (requiredRole) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user || user.role !== requiredRole) {
        return res.status(403).json({ error: `${requiredRole} roli kerak` });
      }
      next();
    } catch (error) {
      res.status(500).json({ error: "Server xatosi" });
    }
  };
};

module.exports = { verifyToken, verifyAdmin, authorizeRole };
