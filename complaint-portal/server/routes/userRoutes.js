const express = require('express');
const auth = require('../middleware/auth');
const allowRoles = require('../middleware/roles');
const userController = require('../controllers/userController');

const router = express.Router();

router.use(auth, allowRoles('user'));
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

module.exports = router;
