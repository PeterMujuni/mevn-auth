const express = require('express')
const { check } = require('express-validator')
const router = express.Router()

// controllers
const {
    signupUser,
} = require('../controllers/auth')

router.post(
    '/signup', 
    [
        check("userName").trim().notEmpty(),
        check("firstName").trim().notEmpty(),
        check("lastName").trim().notEmpty(),
        check("email").normalizeEmail({gmail_remove_dots: false}).isEmail(),
        check("password").isLength({min : 6}),
    ],
    signupUser
)

module.exports = router