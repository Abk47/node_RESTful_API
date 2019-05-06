const express = require('express');
const router = express.Router();

const UsersController = require('../controllers/users');

router.post('/signup', UsersController.usersSignupUser);

router.post('/login', UsersController.usersLoginUser);

router.delete('/:userId', UsersController.usersDeleteUser);

module.exports = router;