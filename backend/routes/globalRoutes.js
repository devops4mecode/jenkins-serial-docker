const express = require('express');
const router = express.Router();
const globalController = require('../controllers/globalController');

// Routes
router
    .get('/detail', globalController.getSerialDetails)
    .patch('/redeem', globalController.redeemSerials)
    // !NEW 2023-05-12
    .post('/request', globalController.requestSerials)

module.exports = router