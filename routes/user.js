const router = require('express').Router();
const userController = require('../controllers/user');
const { isAuthenticated } = require('../middleware/authenticate');

router.get('/', isAuthenticated, userController.getUser);
router.put('/', isAuthenticated, userController.updateUser);
router.delete('/', isAuthenticated, userController.deleteUser);

module.exports = router;