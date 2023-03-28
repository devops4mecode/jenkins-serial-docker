const express = require('express')
const router = express.Router()
const serialController = require('../controllers/serialController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router
    .get('/all', serialController.getAllSerials)
    .post('/generate', serialController.generateSerials)
    .get('/details', serialController.getSerialDetails)
    .patch('/redeem', serialController.redeemSerials)

module.exports = router