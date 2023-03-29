const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
// const loginLimiter = require("../middleware/loginLimiter");

router.route('/')
    .get(userController.getAllUsers)
    .patch(userController.updateUser)

module.exports = router;
