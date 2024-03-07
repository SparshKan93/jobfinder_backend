const express = require('express');
const router = express.Router();
const Posts = require('../models/Posts')

// Route1: Get all the Posts using: GET "/api/posts/fetchallposts". Public endpoint
router.get('/fetchallposts', async (req, res) => {
    try {
        const posts = await Posts.find();
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



module.exports = router