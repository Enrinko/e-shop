const Router = require('express');
const router = new Router();
const controller = require('../controllers/ratingController');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/', checkRole('ADMIN'), controller.create);
router.delete('/:id', checkRole('ADMIN'), controller.delete);
router.put('/:id', checkRole('ADMIN'), controller.update);
router.get('/', controller.getAll);

module.exports = router;