const { Device, DeviceInfo, Brand } = require('../models/models');
const ApiError = require('../error/ApiError');
const uuid = require('uuid');
const path = require('path');

class DeviceController {
  async create (req, res, next) {
    try {
      let { name, price, brandId, typeId, info } = req.body;
      const { img } = req.files;
      let fileName = uuid.v4() + '.jpg';
      await img.mv(path.resolve(__dirname, '..', 'static', fileName));
      const device = await Device.create({ name, price, brandId, typeId, img: fileName });
      if (info) {
        info = JSON.parse(info);
        info.forEach(i => DeviceInfo.create({
          title      : i.title,
          description: i.description,
          deviceId   : device.id
        }));
      }
      return res.json(device);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }
  
  async getAll (req, res) {
    let { brandId, typeId, limit, page } = req.query;
    page = page || 1;
    limit = limit || 9;
    let offset = page * limit - limit;
    let devices;
    if (!brandId && !typeId) {
      devices = await Device.findAndCountAll({ limit, offset });
    }
    if (!brandId && typeId) {
      devices = await Device.findAndCountAll({ where: { typeId }, limit, offset });
    }
    if (brandId && !typeId) {
      devices = await Device.findAndCountAll({ where: { brandId }, limit, offset });
      
    }
    if (brandId && typeId) {
      devices = await Device.findAndCountAll({ where: { typeId, brandId }, limit, offset });
      
    }
    return res.json(devices);
  }
  
  async update(req, res, next) {
    try {
      let { id, name, price, brandId, typeId, info } = req.body;
      const { img } = req.files;
      let fileName = uuid.v4() + '.jpg';
      await img.mv(path.resolve(__dirname, '..', 'static', fileName));
      const device = await Device.create({ name, price, brandId, typeId, img: fileName });
      if (info) {
        info = JSON.parse(info);
        info.forEach(i => DeviceInfo.create({
          title      : i.title,
          description: i.description,
          deviceId   : device.id
        }));
      }
      return res.json(device);
    } catch (e) {
      return next(ApiError.badRequest(e.message));
    }
  }
  async delete(req, res) {
    const { devices } = req.body;
    try {
      await devices.forEach(async device => await Device.destroy({where: {id: device}}));
    } catch ( e ) {
      ApiError.internal("Что-то пошло не так!");
    }
    return res.json({ message: `Записи в количестве ${devices.length} были удалены <br> Было получено ${devices.length} записей` });
  }
  
  async getOne (req, res) {
    const { id } = req.params;
    const device = await Device.findOne(
      {
        where  : { id },
        include: [{ model: DeviceInfo, as: 'info' }]
      }
    );
    return res.json(device);
  }
}

module.exports = new DeviceController();