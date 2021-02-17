const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const multer = require("multer");
const storage = multer.memoryStorage();

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   },
// });

const upload = multer({ storage: storage });

router.post("/", upload.single("photo"), async (req, res, next) => {
  try {
    fs.access("./uploads", (err) => {
      if (err) {
        fs.mkdirSync("./uploads");
      }
    });

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const uniqueFileName = uniqueSuffix + path.extname(req.file.originalname);
    const filePath = `uploads/${uniqueFileName}`;

    await sharp(req.file.buffer)
      .resize({ width: 640, height: 360 })
      .jpeg({ quality: 60 })
      .toFile(`./${filePath}`);

    res.json({ path: filePath });
  } catch (error) {
    next(error);
  }
});

// router.get("/", (req, res) => {
//   res.send("hello");
// });

module.exports = router;
