const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    admin: { type: Boolean, default: false },
    resetPasswordToken: {
      token: { type: String, default: null },
      expiresIn: { type: Date, default: null },
    },
  },
  { timestamps: true }
);

userSchema.plugin(uniqueValidator);
userSchema.set("toJSON", { getters: true });

userSchema.pre("save", async function () {
  const user = this;

  if (user.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);

    user.password = hash;
  }
});

userSchema.methods.comparePasswords = async function (password) {
  const isValid = await bcrypt.compare(password, this.password);
  return isValid;
};

userSchema.methods.compareResetToken = async function (token) {
  const isValid = await bcrypt.compare(token, this.resetPasswordToken.token);
  return isValid;
};

userSchema.methods.signToken = function (user) {
  return jwt.sign(
    {
      userId: user.id,
      admin: user.admin,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: 24 * 60 * 60 * 7,
    }
  );
};

userSchema.methods.generateResetPasswordToken = async function () {
  const token = crypto.randomBytes(32).toString("hex");

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(token, salt);

  const date = new Date();

  this.resetPasswordToken = {
    token: hash,
    expiresIn: date.setHours(date.getHours() + 1),
  };

  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
