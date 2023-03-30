const express = require('express');
const router = express.Router();
const serialController = require('../controllers/serialController');
const verifyJWT = require('../middleware/verifyJWT');

// Middleware function to skip authentication for certain routes
const skipAuth = (req, res, next) => {
    // Skip authentication for the "getSerialDetails" and "redeemSerials" routes
    if (req.path === '/details' || req.path === '/redeem') {
        return next();
    }
    // Continue with authentication for all other routes
    return verifyJWT(req, res, next);
};

// Routes
router
    .get('/all', verifyJWT, serialController.getAllSerials)
    .get('/status', verifyJWT, serialController.getSerialsByStatus)
    .post('/generate', verifyJWT, serialController.generateSerials)
    .get('/details', serialController.getSerialDetails)
    .patch('/redeem', serialController.redeemSerials);

// Use middleware function to skip authentication for certain routes
router.use(skipAuth);

module.exports = router