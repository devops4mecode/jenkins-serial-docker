const express = require('express');
const router = express.Router();
const angpaoController = require('../controllers/angpaoController');

// Routes
router
    .post('/', angpaoController.createAngpao)
// .get('/chart', angpaoController.getChartData)
// .get('/summary', angpaoController.getSummaryData)

module.exports = router