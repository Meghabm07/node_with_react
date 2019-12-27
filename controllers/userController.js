const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {
    validationResult
} = require('express-validator');
const User = require('../models/User');

exports.register = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const {
        name,
        email,
        password
    } = req.body;


    try {
        //See if User exists
        let user = await User.findOne({
            email
        });

        if (user) {
            res.status(400).json({
                errors: [{
                    msg: 'User already Exists'
                }]
            });
        }

        //get users gravatar

        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: '404'
        });

        user = new User({
            name,
            email,
            avatar,
            password
        });

        // Encrypt Password

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, config.get('jwtSecret'), {
            expiresIn: 3600000
        }, (err, token) => {
            if (err) {
                throw err;
            } else {
                res.json({
                    token
                });
            }
        });
    } catch (error) {
        res.status(500).send('Server Error');
    }
};