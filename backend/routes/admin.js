const express = require("express");
const router = express.Router();
const Role = require("../models/role");
const User = require("../models/user");
const { verifyToken, verifyAdmin } = require("../middleware/auth"); // To'g'ri middleware nomi
const bcrypt = require("bcryptjs");

router.get("/roles", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const roles = await Role.find({}, "-password"); // parolni ko‘rsatmaymiz
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: "Server xatosi" });
  }
});
// Faqat admin role yaratishi mumkin
router.post("/addrole", verifyToken, verifyAdmin, async (req, res) => {
  const { name, file } = req.body;
  if (typeof name !== "string" || typeof file !== "string") {
    return res
      .status(400)
      .json({ error: "Noto‘g‘ri format: name va file string bo‘lishi kerak" });
  }
  try {
    // Rollar takrorlanishini oldini olish
    const existingRole = await Role.findOne({ name }); // bu yerga string emas, object kerak
    if (existingRole) {
      return res.status(400).json({ error: "Bu rol allaqachon mavjud" });
    }
    const role = new Role({ name, attachFile: file });
    await role.save();
    res.status(201).json(role);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// Barcha userlarni olish (faqat admin)
router.get("/users", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // parolni ko‘rsatmaymiz
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Server xatosi" });
  }
});

router.post("/adduser", verifyToken, verifyAdmin, async (req, res) => {
  try {
    //console.log('POST /adduser body:', req.body); // ← debug
    const { username, password, role, fullName, email } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username va parol talab qilinadi" });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Bu username band" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      role: role || "user",
      fullName,
      email,
    });
    await newUser.save();
    res.status(201).json({ message: "Foydalanuvchi yaratildi" });
  } catch (error) {
    console.error("Add user error:", error); // muhim log
    res.status(500).json({ error: "Server xatosi" });
  }
});
module.exports = router;
