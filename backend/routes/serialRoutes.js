const express = require('express');
const router = express.Router();
const serialController = require('../controllers/serialController');
const verifyJWT = require('../middleware/verifyJWT');

// router.use(verifyJWT)

// Routes
router
    .get('/all', serialController.getAllSerials)
    .get('/detail', serialController.getDetailsBySerialNo)
    .get('/status', serialController.getSerialsByStatus)
    .post('/generate', serialController.generateSerials)
    .delete('/delete', serialController.delSerialsByID)
    // TESTING
    .get('/', serialController.getTesting)

module.exports = router