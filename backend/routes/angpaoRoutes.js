const express = require('express');
const router = express.Router();
const angpaoController = require('../controllers/angpaoController');

// Routes
router
    .post('/new', angpaoController.createAngpao)
    .get('/open', angpaoController.getAngpao)
    .patch('/redeem', angpaoController.redeemAngpao)

module.exports = router