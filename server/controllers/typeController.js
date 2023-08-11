const { Type } = require('../models/models');
const ApiError = require('../error/ApiError');
const checkEmptinessMiddleware = require('../middleware/checkEmptinessMiddleware');

class TypeController {
  async create (req, res) {
    const { types } = req.body;
    let result = await checkEmptinessMiddleware.removeEmptyFromStringArray(types);
    try {
      await result.forEach(async type => await Type.create({ name: type }));
    } catch ( e ) {
      ApiError.internal("Что-то пошло не так!");
    }
    return res.json({ message: `Записи в количестве ${result.length} были добавлены!` });
  }
  async update(req, res) {
    const { types } = req.body;
    let result = await checkEmptinessMiddleware.removeEmptyFromObjectArray(types);
    try {
      await result.forEach(async type => await Type.update({ name: type.name }, {where: {id: type.id}}));
    } catch ( e ) {
      ApiError.internal("Что-то пошло не так!");
    }
    return res.json({ message: `Записи в количестве ${result.length} были изменены!<br> Было получено ${types.length} записей` });
  }
  async delete(req, res) {
    const { types } = req.body;
    try {
      await types.forEach(async type => await Type.destroy({where: {id: type}}));
    } catch ( e ) {
      ApiError.internal("Что-то пошло не так!");
    }
    return res.json({ message: `Записи в количестве ${types.length} были удалены <br> Было получено ${types.length} записей` });
  }
  
  async getAll (req, res) {
    return res.json(await Type.findAll());
  }
}

module.exports = new TypeController();