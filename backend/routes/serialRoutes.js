const express = require('express');
const router = express.Router();
const serialController = require('../controllers/serialController');
const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT)

// Routes
router
    .get('/all', verifyJWT, serialController.getAllSerials)
    .get('/detail', verifyJWT, serialController.getDetailsBySerialNo)
    .get('/status', verifyJWT, serialController.getSerialsByStatus)
    .post('/generate', verifyJWT, serialController.generateSerials)

module.exports = router