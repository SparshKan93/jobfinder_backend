const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchUser')

const JWT_SECRET = process.env.JWT_SECRET

// Route1: Create a User using: POST "/api/auth/createuser". No login required
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
    body('phoneNumber', 'PhoneNumber must be 10 digits').isLength({ min: 10 }),
], async (req, res) => {
    // If there are errors, return bad request and error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // Check whether the user exist already
    try {
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt)
        const { name, email, phoneNumber } = req.body;
        // Create a new user
        const user = await User.create({ name, email, password: secPass, phoneNumber});
        const data = {
            user: {
                id: user.id
            }
        };
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({authToken});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Route2: Create a User using: POST "/api/auth/login". No login required
router.post('/login', [
    body('loginIdentifier', 'Enter a valid email or phone number').exists(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
    // If there are errors, return bad request and error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { loginIdentifier, password } = req.body;

    try {
        // Find user by email or phone number
        let user = await User.findOne({
            $or: [{ email: loginIdentifier }, { phoneNumber: loginIdentifier }]
        });

        if (!user) {
            return res.status(400).json({ error: "Invalid login credentials" });
        }

        // Compare passwords
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ error: "Invalid login credentials" });
        }

        // Generate authentication token
        const data = {
            user: {
                id: user.id
            }
        };
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({ authToken });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Route3: Get loggedin User Details using: POST "/api/auth/getuser". Login required
router.post('/getuser', fetchUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



module.exports = router;
