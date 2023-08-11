const Router = require('express');
const router = new Router();
const controller = require('../controllers/deviceController');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/', checkRole('ADMIN'), controller.create);
router.delete('/', checkRole('ADMIN'), controller.delete);
router.put('/:id', checkRole('ADMIN'), controller.update);
router.get('/', controller.getAll);
router.get('/:id', controller.getOne);

module.exports = router;