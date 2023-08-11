const jwt = require('jsonwebtoken');
const ApiError = require('../error/ApiError');
module.exports = function (req, res, next) {
  if (req.method === 'OPTIONS') {
    next();
  }
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      next(ApiError.unauthorized('Не авторизован!'));
    }
    req.user = jwt.verify(token, process.env.SECRET_KEY);
    next();
  } catch (e) {
    next(ApiError.unauthorized('Не авторизован!'));
  }
};