const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');

// Define the signup route
router.post('/signup', userController.signup);
router.post('/login',userController.login)
module.exports = router;