const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT)

// Routes
router
    .get('/chartData', dashboardController.getChartData)
    .get('/summary', dashboardController.getSummary)

module.exports = router