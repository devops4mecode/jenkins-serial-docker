const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
// const loginLimiter = require("../middleware/loginLimiter");

const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT)

router
    .get('/:id', userController.getUser)
    .get('/', userController.getAllUsers)
    // .patch('/:id', userController.updateUser)
    .patch('/update', userController.changePassword)

module.exports = router;
