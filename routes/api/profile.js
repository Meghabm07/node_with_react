const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const {
    check,
    validationResult
} = require('express-validator');
const auth = require('../../middleware/auth');

const Profile = require('../../models/Profile.js');
const User = require('../../models/User.js');

// @route GET api/profile/me
// @desc  Get current user Profile
// @acess Private
router.get('/me', auth, async(req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({
                msg: 'No Profile Found'
            });
        }

        res.json(profile);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error');
    }
});

// @route GET api/profile
// @desc  Create or Update Profile
// @acess Private
router.post(
    '/', [
        auth, [check('status', 'Status is required').not().isEmpty(), check('skills', 'Skills is required').not().isEmpty()]
    ],
    async(req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const {
            company,
            website,
            location,
            status,
            skills,
            bio,
            githubusername,
            experiance,
            education,
            youtube,
            twitter,
            facebook,
            linkedin,
            instagram,
            date
        } = req.body;

        //Build Profile Object

        const profileFields = {};

        profileFields.user = req.user.id;

        if (company) profileFields.company = company;

        if (website) profileFields.website = website;

        if (location) profileFields.location = location;

        if (bio) profileFields.bio = bio;

        if (status) profileFields.status = status;

        if (githubusername) profileFields.githubusername = githubusername;

        if (skills) {
            profileFields.skills = skills.split(',').map((skill) => skill.trim());
        }

        // Build Social Object

        profileFields.social = {};

        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (instagram) profileFields.social.instagram = instagram;

        try {
            let profile = await Profile.findOne({
                user: req.user.id
            });

            if (profile) {
                profile = await Profile.findOneAndUpdate({
                    user: req.user.id
                }, {
                    $set: profileFields
                }, {
                    useFindAndModify: false
                });
                return res.json(profile);
            } else {
                profile = new Profile(profileFields);

                await profile.save();
            }

            // // Create

            res.json(profile);
        } catch (error) {
            console.log(error.message);

            return res.status(500).send('Server Error');
        }
    }
);


// @route GET api/profile
// @desc  Get all Profile
// @acess Public
router.get('/', async(req, res) => {
    try {
        const profiles = await Profile.findOne({
            "name": "Megha",
        }).populate('user');
        res.json(profiles);
    } catch (error) {
        res.status(500).send('Server Error')
        console.log(error.message);

    }
});

// @route GET api/profile/user/user_id
// @desc  Get  Profile by user ID
// @acess Public
router.get('/user/:user_id', async(req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.params.user_id
        }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({
                msg: 'No profile Found'
            })
        }

        res.json(profile);
    } catch (error) {
        if (error.kind == 'ObjectId') {
            return res.status(400).json({
                msg: 'No profile Found'
            })
        }
        res.status(500).send('Server Error')
        console.log(error.message);

    }
});

// @route Delete api/profile
// @desc  Delete Profile, user & posts
// @acess Private
router.delete('/', auth, async(req, res) => {
    try {

        // remove profile
        await Profile.findOneAndRemove({
            user: req.user.id
        });

        // remove user
        await User.findOneAndRemove({
            _id: req.user.id
        });

        res.json({
            msg: "User Removed"
        });

    } catch (error) {
        if (error.kind == 'ObjectId') {
            return res.status(400).json({
                msg: 'No profile Found'
            })
        }
        res.status(500).send('Server Error')
        console.log(error.message);

    }
});

// @route PUT api/profile/experience
// @desc  Add prfile experiance
// @acess Private
router.put(
    '/experiance', [
        auth, [
            check('title', 'title is required').not().isEmpty(),
            check('company', 'company is required').not().isEmpty(),
            check('from', 'From Date is required').not().isEmpty()
        ]
    ],
    async(req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const {
            title,
            company,
            location,
            from,
            to,
            current,
            discription,
        } = req.body;

        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            discription,
        }

        try {
            const profile = await Profile.findOne({
                user: req.user.id
            });

            profile.experiance.unshift(newExp);

            await profile.save();

            res.json(profile);
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server error')

        }

    }

);

// @route PUT api/profile/experience
// @desc  Add prfile experiance
// @acess Private
router.delete(
    '/experiance/:exp_id', [
        auth,
    ],
    async(req, res) => {

        try {
            const profile = await Profile.findOne({
                user: req.user.id
            });

            // Get remove Index
            const removeIndex = profile.experiance.map(item => item.id).indexOf(req.params.exp_id)

            profile.experiance.splice(removeIndex, 1);

            await profile.save();

            res.json(profile);
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server error')

        }

    }

);

// @route PUT api/profile/education
// @desc  Add prfile education
// @acess Private
router.put(
    '/education', [
        auth, [
            check('school', 'school is required').not().isEmpty(),
            check('degree', 'degree is required').not().isEmpty(),
            check('fieldofstudy', 'field of study is required').not().isEmpty(),
            check('from', 'From Date is required').not().isEmpty()
        ]
    ],
    async(req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            discription,
        } = req.body;

        const newEdu = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            discription,
        }

        try {
            const profile = await Profile.findOne({
                user: req.user.id
            });

            profile.education.unshift(newEdu);

            await profile.save();

            res.json(profile);
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server error')

        }

    }

);

// @route PUT api/profile/education/edu_id
// @desc  Add prfile education
// @acess Private
router.delete(
    '/education/:edu_id', [
        auth,
    ],
    async(req, res) => {

        try {
            const profile = await Profile.findOne({
                user: req.user.id
            });

            // Get remove Index
            const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id)

            profile.education.splice(removeIndex, 1);

            await profile.save();

            res.json(profile);
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server error')

        }

    }

);

// @route GET api/profile/github/:username
// @desc  Get user repos from github
// @acess Public
router.get(
    '/github/:username',
    async(req, res) => {

        try {
            const options = {
                uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
                method: 'GET',
                headers: {
                    'user-agent': 'node.js'
                }
            }

            request(options, (error, response, body) => {
                if (error) {
                    console.error(error);
                }
                console.log(response);

                if (response.statusCode !== 200) {
                    res.status(404).json({
                        msg: "No Github Repo found"
                    });
                    return;
                }
                res.json(JSON.parse(body));
            })

        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server error')

        }

    }

);

module.exports = router;