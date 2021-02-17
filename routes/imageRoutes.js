const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("photo"), function (req, res, next) {
  // req.file is the `avatar` file
  res.json({ path: req.file.path });
  // req.body will hold the text fields, if there were any
});

// router.get("/", (req, res) => {
//   res.send("hello");
// });

module.exports = router;
