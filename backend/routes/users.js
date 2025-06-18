const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

// User maʼlumotlarini yangilash (faqat admin)
router.put("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "Foydalanuvchi topilmadi" });
    }

    res.json({ message: "Foydalanuvchi yangilandi", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Server xatosi" });
  }
});

// Userni o‘chirish (faqat admin)
router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.json({ message: "Foydalanuvchi o‘chirildi" });
  } catch (error) {
    res.status(500).json({ error: "Server xatosi" });
  }
});

module.exports = router;
