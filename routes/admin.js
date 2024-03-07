const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Posts = require('../models/Posts')
const fetchUser = require('../middleware/fetchUser')


// Route1: Add a new Post: POST "/api/admin/addPost". Admin endpoint
router.post('/addPost', fetchUser, async (req, res) => {
    try {
        const { image, role, companyName, skillsRequired, stipend, location} = req.body;
        const userId = req.user.id;
        const user = await User.findById(userId).select("isAdmin");
        // console.log(user)
        if (!user || user.isAdmin === false) {
            return res.status(403).json({ error: 'Only admin users are allowed to create posts.' });
        }
        const post = new Posts({
            image, role, companyName, skillsRequired, stipend, location,
            // Assuming you want to associate the post with the user who created it
            createdBy: userId,
        });

        const savedPost = await post.save();
        res.json(savedPost);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});

// Route2: Update an existing Post: POST: PUT "/api/admin/updatePost". Admin endpoint
router.put('/updatePost/:id', fetchUser, async (req, res) => {
    try {
        // Use the spread operator to create a newPost object
        const userId = req.user.id;
        const user = await User.findById(userId).select("isAdmin");
        // console.log(user)
        if (!user || user.isAdmin === false) {
            return res.status(403).json({ error: 'Only admin users are allowed to create posts.' });
        }
        const newPost = { ...req.body };

        // Find the post to be updated and update it
        let post = await Posts.findById(req.params.id);
        if (!post) {
            return res.status(404).send("Not Found");
        }

        post = await Posts.findByIdAndUpdate(req.params.id, { $set: newPost }, { new: true });
        res.json({ post });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route3: Delete an existing Post: DELETE: PUT "/api/admin/deletePost". Admin endpoint
router.delete('/deletePost/:id', fetchUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("isAdmin");
        // console.log(user)
        if (!user || user.isAdmin === false) {
            return res.status(403).json({ error: 'Only admin users are allowed to create posts.' });
        }
        // Find the post to be deleted
        let post = await Posts.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Attempt to delete the post
        post = await Posts.findByIdAndDelete(req.params.id);
        if (!post) {
            return res.status(500).json({ error: "Failed to delete post" });
        }

        res.status(200).json({ success: "Post has been deleted", post: post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



module.exports = router;
