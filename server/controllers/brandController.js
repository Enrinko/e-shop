const { Brand } = require('../models/models');
const ApiError = require('../error/ApiError');
const checkEmptinessMiddleware = require('../middleware/checkEmptinessMiddleware');
const _ = require('lodash');

class BrandController {
  async create (req, res) {
    const { brands } = req.body;
    let result = _.uniq(brands);
    if (result.length !== 0) {
      result = await Brand.bulkCreate(result);
    }
    return res.json(result);
  }
  
  async update (req, res) {
    const { brands } = req.body;
    let result = await checkEmptinessMiddleware.removeEmptyFromObjectArray(brands);
    try {
      await result.forEach(async brand => await Brand.update({ name: brand.name }, { where: { id: brand.id } }));
    } catch (e) {
      ApiError.internal('Что-то пошло не так!');
    }
    return res.json({ message: `Записи в количестве ${result.length} были изменены!<br> Было получено ${brands.length} записей` });
  }
  
  async delete (req, res) {
    const { brands } = req.body;
    try {
      await brands.forEach(async brand => await Brand.destroy({ where: { id: brand } }));
    } catch (e) {
      ApiError.internal('Что-то пошло не так!');
    }
    return res.json({ message: `Записи в количестве ${brands.length} были удалены <br> Было получено ${brands.length} записей` });
  }
  
  async getAll (req, res) {
    return res.json(await Brand.findAll());
  }
}

module.exports = new BrandController();