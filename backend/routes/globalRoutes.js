const express = require('express');
const router = express.Router();
const globalController = require('../controllers/globalController');

// Routes
router
    .get('/detail', globalController.getSerialDetails)
    .patch('/redeem', globalController.redeemSerials)

module.exports = router