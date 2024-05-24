const router = require('express').Router();
const userController = require('../controllers/user');
const { isAuthenticated } = require('../middleware/authenticate');

router.get('/', isAuthenticated, userController.getUser);
router.put('/:id', isAuthenticated, userController.updateUser);

module.exports = router;