const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Username bo'yicha userni topamiz
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "Foydalanuvchi topilmadi" });
    }

    // Parolni tekshirish
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Parol noto‘g‘ri" });
    }

    // Token yaratish
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Foydalanuvchining roli bilan birga qaytaramiz
    res.status(200).json({
      message: "Kirish muvaffaqiyatli",
      token,
      role: user.role, // 👈 bu joy MUHIM
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

module.exports = router;
