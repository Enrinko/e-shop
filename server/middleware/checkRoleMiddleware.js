const ApiError = require('../error/ApiError');
const jwt = require('jsonwebtoken');
module.exports = (role) => {
  return function (req, res, next) {
    if (req.method === 'OPTIONS') {
      next();
    }
    try {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        return next(ApiError.unauthorized('Не авторизован!'));
      }
      req.user = jwt.verify(token, process.env.SECRET_KEY);
      if (req.user.role !== role) {
        return next(ApiError.forbidden('У вас нет доступа!'));
      }
      next();
    } catch (e) {
      return next(ApiError.unauthorized('Не авторизован!'));
    }
  };
};