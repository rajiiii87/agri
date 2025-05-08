const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Farmer Signup
router.post('/farmer_signup', async (req, res) => {
    const { name, email, password, location } = req.body; // Ensure location is extracted
    try {
        if (!location || location.trim() === "") {
            return res.status(400).json({ error: "Location is required" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role: 'farmer', location });

        await newUser.save();

        console.log("Farmer Registered:", newUser); // Debugging
        res.status(201).json({ message: 'Farmer registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Customer Signup
router.post('/customer_signup', async (req, res) => {
    const { name, email, password, location } = req.body;
    try {
        if (!location) {
            return res.status(400).json({ error: "Location is required" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role: 'customer', location });
        await newUser.save();
        res.status(201).json({ message: 'Customer registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Farmer Login
router.post('/farmer_login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, role: 'farmer' });

        if (!user) {
            return res.status(404).json({ message: 'Farmer not found' });
        }

        console.log("Farmer Data:", user); // Debugging

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

        res.json({
            token,
            farmerName: user.name,
            farmerLocation: user.location,  // Ensure location is included
            farmerId: user._id
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Customer Login
router.post('/customer_login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, role: 'customer' });

        if (!user) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        console.log("Customer Data:", user); // Debugging

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

        res.json({
            token,
            customerName: user.name,
            customerLocation: user.location,  // Ensure this is sent
            customerId: user._id
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;