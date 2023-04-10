const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
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
    .get('/serialsData', verifyJWT, dashboardController.getSerialsData)

// Use middleware function to skip authentication for certain routes
router.use(skipAuth);

module.exports = router