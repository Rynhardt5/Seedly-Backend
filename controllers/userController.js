const User = require('../models/User');
const HttpError = require('../utils/HttpError');
const mailer = require('../config/mailer');
const { validationResult } = require('express-validator');

const registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let user = await User.findOne({ email: req.body.email });

    if (user) {
      return next(
        new HttpError('User already exist please try logging in instead', 422)
      );
    }

    user = new User({
      ...req.body,
    });

    await user.save();

    const token = user.signToken(user);

    res.json({ token });
  } catch (error) {
    next(error);
  }
};

const logUserIn = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(new HttpError('No users found in database', 404));
    }

    const passwordValid = await user.comparePasswords(req.body.password);

    if (!passwordValid) {
      return next(
        new HttpError("Password doesn't match, please try again", 422)
      );
    }

    const token = user.signToken(user);

    res.json({ token });
  } catch (error) {
    next(error);
  }
};

const currentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return next(new HttpError('No user found in database with that id', 404));
    }

    return res.json({ user });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password -email');

    if (users.length !== 0) {
      return res.json({ users });
    }

    return next(new HttpError('No users found in database', 404));
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password -email');

    if (!user) {
      return next(new HttpError('No users found in database', 404));
    }

    return res.json({ user });
  } catch (error) {
    next(error);
  }
};

const resetPasswordByEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(
        new HttpError('No users found in database with that email', 404)
      );
    }

    const token = await user.generateResetPasswordToken();

    await user.save();

    mailer({
      from: 'rynhardt.smith@gmail.com',
      to: user.email,
      subject: 'Password reset request from seedly',
      html: `Click on the following link to reset your password, please note that this reset token expires in an hour  <a href="http://localhost:3000/password/reset/${token}/${user.id}">Reset Password</a>`,
    });

    res.json({ passwordResetValid: true });
  } catch (error) {
    next(error);
  }
};

const resetPasswordByToken = async (req, res, next) => {
  try {
    const { token, userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return next(new HttpError('No user found with that email', 422));
    }

    if (user.resetPasswordToken.expiresIn < Date.now()) {
      return next(new HttpError('Reset password token expired', 422));
    }

    const tokenMatches = await user.compareResetToken(
      token,
      user.resetPasswordToken.token
    );

    if (!tokenMatches) {
      return next(new HttpError('Reset password token invalid', 422));
    }

    user.password = req.body.password;

    await user.save();

    const jwtToken = user.signToken(user);

    res.json({ token: jwtToken });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  registerUser,
  getAllUsers,
  getUserById,
  logUserIn,
  currentUser,
  resetPasswordByToken,
  resetPasswordByEmail,
};
