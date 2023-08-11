const ApiError = require('../error/ApiError');
const { User, Basket } = require('../models/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkEmptinessMiddleware = require('../middleware/checkEmptinessMiddleware');

const generateJwt = function (id, email, role) {
  return jwt.sign(
    { id: id, email: email, role: role },
    process.env.SECRET_KEY,
    { expiresIn: '24h' }
  );
};

class UserController {
  async reg (req, res, next) {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return next(ApiError.badRequest('Некорректный email или password'));
    }
    if (await User.findOne({ where: { email } })) {
      return next(ApiError.badRequest('Пользователь с таким email уже существует!'));
    }
    const hashPassword = await bcrypt.hash(password, 5);
    const user = await User.create({ email, role, password: hashPassword });
    const basket = await Basket.create({ userId: user.id });
    const token = generateJwt(user.id, user.email, user.role);
    return res.json({ token });
  }
  
  async login (req, res, next) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(ApiError.badRequest('Пользователь не найден!!'));
    }
    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return next(ApiError.badRequest('Указан неправильный логин или пароль!!'));
    }
    const token = generateJwt(user.id, user.email, user.role);
    return res.json({ token });
  }
  
  async update(req, res) {
    const { users } = req.body;
    let result = await checkEmptinessMiddleware.removeEmptyFromStringArray(users);
    try {
      await result.forEach(async user => await User.update({ email: user.email, password: await bcrypt.hash(user.password, 5), role: user.role }, {where: {id: user.id}}));
    } catch ( e ) {
      ApiError.internal("Что-то пошло не так!");
    }
    return res.json({ message: `Записи в количестве ${result.length} были изменены!` });
  }
  async delete(req, res) {
    const { users } = req.body;
    try {
      await users.forEach(async user => await User.destroy({where: {id: user}}));
    } catch ( e ) {
      ApiError.internal("Что-то пошло не так!");
    }
    return res.json({ message: `Записи в количестве ${users.length} были удалены <br> Было получено ${users.length} записей` });
  }
  
  async logout(req, res) {
  }
  
  async auth (req, res, next) {
    return res.json(generateJwt(req.user.id, req.user.email, req.user.role));
  }
}

module.exports = new UserController();