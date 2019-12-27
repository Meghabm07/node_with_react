const express = require('express');
const router = express.Router();
const {
    check,
    validationResult
} = require('express-validator');

const auth = require('../../middleware/auth');
const Post = require('../../models/Post');
const User = require('../../models/User');
const Profile = require('../../models/Profile');


// @route POST api/post
// @desc  Create a Post
// @acess Private 
router.post('/', [auth, [
    check('text', 'Text is required').not().isEmpty()
]], async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: error.array()
        })
    }

    try {
        const user = await User.findById(req.user.id);

        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id,
        })

        const post = await newPost.save();

        res.json(post);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error')
    }

});
// @route Get api/post
// @desc  Get all Post
// @acess Private 
router.get('/', auth, async(req, res) => {

    try {
        const posts = await Post.find().sort({
            date: -1
        });

        res.json(posts);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error')
    }

});

// @route Get api/post/:post_id
// @desc  Get particular Post
// @acess Private 
router.get('/:post_id', auth, async(req, res) => {

    try {
        const post = await Post.findById(req.params.post_id);

        if (!post) {
            res.status(404).json({
                msg: "Post Not Found"
            });
        }

        res.json(post);

    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            res.status(404).json({
                msg: "Post Not Found"
            });
        }
        res.status(500).send('Server error')
    }

});

// @route DELET api/post/:post_id
// @desc  DELET particular Post
// @acess Private 
router.delete('/:post_id', auth, async(req, res) => {

    try {
        const post = await Post.findById(req.params.post_id);

        if (!post) {
            res.status(404).json({
                msg: "Post Not Found"
            });
        }

        if (post.user.toString() !== req.user.id) {
            res.status(401).json({
                msg: "Not Autherised"
            });
        }

        await post.remove();

        res.json({
            msg: "Post Removed"
        });

    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            res.status(404).json({
                msg: "Post Not Found"
            });
        }
        res.status(500).send('Server error')
    }

});

// @route PUT api/post/like/:post_id
// @desc  Like Post
// @acess Private 
router.put('/like/:post_id', auth, async(req, res) => {

    try {
        const post = await Post.findById(req.params.post_id);

        if (!post) {
            res.status(404).json({
                msg: "Post Not Found"
            });
            return;
        }

        // check post already been liked
        if (post.likes.filter(like => like.user.toString() == req.user.id).length > 0) {
            res.status(400).json({
                msg: 'Post already Liked'
            });

            return;
        }

        if (post.user.toString() !== req.user.id) {
            res.status(401).json({
                msg: "Not Autherised"
            });
            return;

        }

        post.likes.unshift({
            user: req.user.id
        });

        await post.save();

        res.json(post.likes);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error')
    }

});

// @route POST api/post/like/:post_id
// @desc  UnLike Post
// @acess Private 
router.post('/unlike/:post_id', auth, async(req, res) => {

    try {

        const post = await Post.findById(req.params.post_id);

        // check post already been liked
        if (post.likes.filter(like => like.user.toString() == req.user.id).length === 0) {
            res.status(400).json({
                msg: 'Post has not yet been Liked'
            });
            return;
        }

        //get removed index
        const removeIndex = post.likes.map(like => like.user.toString());

        post.likes.splice(removeIndex, 1);

        await post.save();

        res.json(post.likes);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error')
    }

});

// @route POST api/post/comment/:id
// @desc  Comment a Post
// @acess Private 
router.post('/comment/:post_id', [auth, [
    check('text', 'Text is required').not().isEmpty()
]], async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: error.array()
        })
    }

    try {

        const user = await User.findById(req.user.id);
        const post = await Post.findById(req.params.post_id);

        const newComent = {
            text: req.body.text,
            user: req.user.id,
        };

        post.comments.unshift(newComent);

        await post.save();

        res.json(post.comments);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error')
    }

});

// @route DELETE api/post/comment/:post_id
// @desc  DELETE Post
// @acess Private 
router.delete('/comment/:post_id/:comment_id', auth, async(req, res) => {

    try {

        const post = await Post.findById(req.params.post_id,
            function(err, doc) {
                if (err && err.kind == 'ObjectId') {
                    return res.status(404).json({
                        msg: "Post Does not exist"
                    });
                }
            });

        const comment = post.comments.find(comment => comment.id === req.params.comment_id);

        if (!comment) {
            return res.status(404).json({
                msg: "Comment Does not exist"
            });
            return;
        }

        // check user
        if (post.user.toString() !== req.user.id) {
            res.status(401).json({
                msg: "Not Autherised"
            });
            return;
        }

        //get removed index
        const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);

        post.comments.splice(removeIndex, 1);

        await post.save();

        res.json(post.comments);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error')
    }

});

module.exports = router;