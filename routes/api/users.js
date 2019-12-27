const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const UserController = require('../../controllers/userController');

// @route Post api/users
// @desc  Register User
// @access Public

router.post(
    '/', [
        // username must be required
        check('name', 'Name is Required').not().isEmpty(),
        check('email', 'Email is Required').isEmail(),
        check('password', 'Password is Required').isLength({ min: 6 })
    ],
    UserController.register
);

module.exports = router;