const HttpError = require('../utils/HttpError');
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      const error = new HttpError('Unauthorized', 401);
      return next(error);
    }

    const payload = jwt.verify(token, process.env.SECRET_KEY);
    req.user = { id: payload.userId, auth: true, admin: payload.admin };
    next();
  } catch (err) {
    req.user = { auth: false };
    const error = new HttpError('Unauthorized', 401);
    return next(error);
  }
};

module.exports = auth;
