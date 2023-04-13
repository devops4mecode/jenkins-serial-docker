const express = require('express');
const router = express.Router()
const authController = require('../controllers/authController')
const loginLimiter = require('../middleware/loginLimiter')

router.route('/login').post(loginLimiter, authController.login)

module.exports = router