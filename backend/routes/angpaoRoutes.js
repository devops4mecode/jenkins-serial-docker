const express = require('express');
const router = express.Router();
const angpaoController = require('../controllers/angpaoController');
// const verifyJWT = require('../middleware/verifyJWT')

// Routes
router
    .get('/all', angpaoController.getAllAngpao)
    // Integration Routes
    .post('/new', angpaoController.createAngpao)
    .get('/open', angpaoController.getAngpao)
    .patch('/redeem', angpaoController.redeemAngpao)

module.exports = router