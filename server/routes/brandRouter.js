const Router = require('express');
const router = new Router();
const controller = require('../controllers/brandController');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/', checkRole('ADMIN'), controller.create);
router.delete('/', checkRole('ADMIN'), controller.delete);
router.put('/', checkRole('ADMIN'), controller.update);
router.get('/', controller.getAll);

module.exports = router;