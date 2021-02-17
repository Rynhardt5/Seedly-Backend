const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  registerUser,
  getAllUsers,
  getUserById,
  logUserIn,
  currentUser,
  resetPasswordByEmail,
  resetPasswordByToken,
} = require("../controllers/userController");
const { body } = require("express-validator");

router.post(
  "/register",
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ],
  registerUser
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").isLength({ min: 6 })],
  logUserIn
);

router.get("/current", auth, currentUser);

router.get("/", getAllUsers);

router.get("/:id", getUserById);

router.post(
  "/password/reset/email",
  body("email").isEmail(),
  resetPasswordByEmail
);

router.post("/password/reset/:token/:userId", resetPasswordByToken);

module.exports = router;
