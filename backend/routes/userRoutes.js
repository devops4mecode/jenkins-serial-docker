const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
// const loginLimiter = require("../middleware/loginLimiter");

router
    .get('/:id', userController.getUser)
    .get('/', userController.getAllUsers)
    .patch('/:id', userController.updateUser)

module.exports = router;
