// const bycrypt = require('bcryptjs')
const express = require('express');
const router = express.Router()
const authControllers = require('../Controller/authController');


router.post('/signup', authControllers.signup)
router.post('/login', authControllers.login)
router.get('/logout', authControllers.logout)
router.get('/verifyuser',authControllers.verifyuser)

module.exports = router;