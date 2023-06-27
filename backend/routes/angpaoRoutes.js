const express = require('express');
const router = express.Router();
const angpaoController = require('../controllers/angpaoController');

// Routes
router
    .post('/new', angpaoController.createAngpao)
    .patch('/redeem', angpaoController.redeemAngpao)

module.exports = router