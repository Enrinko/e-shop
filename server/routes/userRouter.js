const Router = require('express');
const router = new Router();
const controller = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/reg', controller.reg);
router.post('/log', controller.login);
router.delete('/:id', checkRole('ADMIN'), controller.delete);
router.put('/:id', checkRole('ADMIN'), controller.update);
router.get('/logout', authMiddleware, controller.logout);
router.get('/auth', authMiddleware, controller.auth);

module.exports = router;