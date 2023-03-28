const express = require('express')
const router = express.Router()
const serialController = require('../controllers/serialController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(serialController.getAllSerials)

module.exports = router