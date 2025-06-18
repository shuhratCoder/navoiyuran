const express = require("express");
const fs = require("fs");
const path = require("path");
const { verifyToken } = require("../middleware/auth");
const router = express.Router();

const FILES_DIR = path.join(__dirname, "../baza");

// Qidiruv API
router.get("/files/search", verifyToken, (req, res) => {
  const query = req.query.q?.toLowerCase() || "";
  const dirPath = path.join(__dirname, "..", "baza");

  try {
    const allFiles = fs.readdirSync(dirPath);
    const matched = allFiles.filter((file) =>
      file.toLowerCase().includes(query)
    );
    res.json(matched);
  } catch (err) {
    res.status(500).json({ error: "Qidirishda xatolik" });
  }
});

// Fayllar ro'yxatini olish
router.get("/files", (req, res) => {
  fs.readdir(FILES_DIR, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Fayllarni o‘qishda xatolik" });
    }
    res.json(files);
  });
});

// Faylni ko‘rish (preview)
router.get("/files/:filename", (req, res) => {
  const filePath = path.join(FILES_DIR, req.params.filename);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: "Fayl topilmadi" });
  }
});

// Faylni yuklab olish
router.get("/files/download/:filename", (req, res) => {
  const filePath = path.join(FILES_DIR, req.params.filename);
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ error: "Fayl topilmadi" });
  }
});

module.exports = router;
