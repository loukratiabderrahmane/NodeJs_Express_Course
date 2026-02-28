const express = require('express')
const router = express.Router()
const { handleLougout } = require('../controllers/lougoutController')

router.post('/',handleLougout)

module.exports = router
